import os
import math
import time
import requests
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

RPC_SCHEME = os.getenv("RPC_SCHEME")
RPC_HOST = os.getenv("RPC_HOST")
RPC_PORT = int(os.getenv("RPC_PORT"))
RPC_USER = os.getenv("RPC_USER", "")
RPC_PASSWORD = os.getenv("RPC_PASSWORD", "")
HALVING_INTERVAL = int(os.getenv("HALVING_INTERVAL"))

RPC_URL = f"{RPC_SCHEME}://{RPC_HOST}:{RPC_PORT}"

app = FastAPI(title="Palladium API Endpoints", version="1.0.0")

class HalvingResponse(BaseModel):
    next_halving_height: int
    blocks_remaining: int
    eta_seconds: float
    eta_formatted: str

def format_time_duration(seconds: float) -> str:
    """
    Converts seconds to days-hours-minutes-seconds format
    """
    total_seconds = int(seconds)
    
    days = total_seconds // 86400  # 86400 seconds in a day
    remaining_seconds = total_seconds % 86400
    
    hours = remaining_seconds // 3600  # 3600 seconds in an hour
    remaining_seconds = remaining_seconds % 3600
    
    minutes = remaining_seconds // 60
    seconds = remaining_seconds % 60
    
    parts = []
    if days > 0:
        parts.append(f"{days} days")
    if hours > 0:
        parts.append(f"{hours} hours")
    if minutes > 0:
        parts.append(f"{minutes} minutes")
    parts.append(f"{seconds} seconds")
    
    return ", ".join(parts)

def rpc_call(method: str, params=None):
    if params is None:
        params = []
    payload = {"jsonrpc": "1.0", "id": "palladium-api", "method": method, "params": params}
    try:
        r = requests.post(RPC_URL, json=payload, auth=(RPC_USER, RPC_PASSWORD), timeout=15)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"RPC connection error: {e}")
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail=f"RPC HTTP {r.status_code}: {r.text}")
    data = r.json()
    if data.get("error"):
        raise HTTPException(status_code=502, detail=str(data["error"]))
    return data["result"]

def get_height() -> int:
    return rpc_call("getblockcount")

def get_block_time(height: int) -> int:
    # Use block timestamp (not mediantime) for a more "real" estimate
    block_hash = rpc_call("getblockhash", [height])
    block = rpc_call("getblock", [block_hash])
    return int(block["time"])

@app.get("/height")
def height():
    return {"height": get_height()}

@app.get("/difficulty")
def difficulty():
    # Try getdifficulty first, then getblockchaininfo as fallback
    try:
        diff = rpc_call("getdifficulty")
        return {"difficulty": diff}
    except HTTPException:
        # Fallback: use getblockchaininfo
        try:
            blockchain_info = rpc_call("getblockchaininfo")
            diff = blockchain_info.get("difficulty", 0)
            return {"difficulty": diff}
        except HTTPException as e:
            raise HTTPException(status_code=502, detail=f"Unable to get difficulty: {e.detail}")

@app.get("/hashrate")
def hashrate():
    # Try getnetworkhashps first, then use getmininginfo as fallback
    try:
        hps = rpc_call("getnetworkhashps", [120, -1])
        return {"hashrate": hps}
    except HTTPException:
        # Fallback: use getmininginfo
        try:
            mining_info = rpc_call("getmininginfo")
            hps = mining_info.get("networkhashps", 0)
            return {"hashrate": hps}
        except HTTPException as e:
            raise HTTPException(status_code=502, detail=f"Unable to get hashrate: {e.detail}")

@app.get("/avg-block-time")
def avg_block_time(window: int = Query(120, ge=2, le=2016)):
    """
    Calculate average block time over the specified window:
    (time[h] - time[h-window]) / window
    """
    h = get_height()
    if h < window:
        raise HTTPException(status_code=400, detail="Chain too short for requested window")
    t_last = get_block_time(h)
    t_prev = get_block_time(h - window)
    avg = (t_last - t_prev) / float(window)
    return {"avg_block_time": avg, "window": window}

@app.get("/halving", response_model=HalvingResponse)
def halving():
    h = get_height()
    next_halving_height = ((h // HALVING_INTERVAL) + 1) * HALVING_INTERVAL
    blocks_remaining = max(0, next_halving_height - h)

    # Always use 2 minutes (120 seconds) as block time
    avg_bt = 120.0
    
    eta_seconds = blocks_remaining * avg_bt
    eta_formatted = format_time_duration(eta_seconds)
    
    return HalvingResponse(
        next_halving_height=next_halving_height,
        blocks_remaining=blocks_remaining,
        eta_seconds=eta_seconds,
        eta_formatted=eta_formatted,
    )
