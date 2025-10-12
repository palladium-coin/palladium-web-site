# Palladium API Endpoints

REST API to get information from the Palladium blockchain.

## 📋 Requirements

Before using this API, make sure you have:

### System Requirements
- **Docker** and **Docker Compose** installed on your system
- **Palladium node** running on the host machine (outside the container)
- **RPC server** enabled on the Palladium node

### Palladium Node Configuration
Your Palladium node must be configured with:
- RPC server enabled (`server=1` in palladium.conf)
- RPC credentials configured (`rpcuser` and `rpcpassword`)
- RPC port accessible (default: 2332)
- Node fully synchronized with the blockchain

**Example palladium.conf:**
```conf
server=1
rpcuser=your_username
rpcpassword=your_secure_password
rpcport=2332
rpcallowip=127.0.0.1
rpcallowip=172.17.0.0/16  # Allow Docker containers
```

## Quick Start

1. Copy `.env.example` to `.env` and configure your RPC credentials
2. Run: `docker compose up --build -d`
3. API available at: `http://localhost:8032`

## 📋 API Quick Reference

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `GET /height` | Current blockchain height | None |
| `GET /difficulty` | Current mining difficulty | None |
| `GET /hashrate` | Network hashrate (H/s) | None |
| `GET /avg-block-time` | Average block time | `window` (optional, default: 120) |
| `GET /halving` | Next halving information | None |

## 🔗 Available Endpoints

### `/height` - Blockchain Height
Get the current number of blocks in the blockchain.

```bash
curl http://localhost:8032/height
```

**Response:**
```json
{
  "height": 420123
}
```

---

### `/difficulty` - Mining Difficulty
Get the current network mining difficulty.

```bash
curl http://localhost:8032/difficulty
```

**Response:**
```json
{
  "difficulty": 67957790298897.88
}
```

---

### `/hashrate` - Network Hashrate
Get the current network hashrate in hashes per second.

```bash
curl http://localhost:8032/hashrate
```

**Response:**
```json
{
  "hashrate": 486654321098765.4
}
```

---

### `/avg-block-time` - Average Block Time
Calculate the average time between blocks over a specified window.

```bash
# Default window (120 blocks)
curl http://localhost:8032/avg-block-time

# Custom window (last 100 blocks)
curl http://localhost:8032/avg-block-time?window=100
```

**Parameters:**
- `window` (optional): Number of recent blocks to analyze (default: 120)

**Response:**
```json
{
  "avg_block_time": 122.5,
  "window": 120
}
```

---

### `/halving` - Next Halving Information
Get information about the next block reward halving event.

```bash
curl http://localhost:8032/halving
```

**Response:**
```json
{
  "next_halving_height": 420000,
  "blocks_remaining": 110000,
  "eta_seconds": 13200000,
  "eta_formatted": "152 days, 18 hours, 20 minutes"
}
```

**Notes:**
- ETA calculation uses a fixed 2-minute block time
- `eta_formatted` provides human-readable time remaining

## 📚 Documentation & Configuration

### Interactive API Documentation
- **Swagger UI**: `http://localhost:8032/docs`
- **ReDoc**: `http://localhost:8032/redoc`

### Configuration Setup
1. **Ensure your Palladium node is running** with RPC enabled (see Requirements section above)

2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your RPC credentials (must match your palladium.conf):
   ```env
   RPC_SCHEME=http
   RPC_HOST=host.docker.internal  # Use this for Docker
   RPC_PORT=2332
   RPC_USER=your_rpc_username      # Same as rpcuser in palladium.conf
   RPC_PASSWORD=your_rpc_password  # Same as rpcpassword in palladium.conf
   HALVING_INTERVAL=210000
   ```

**Important**: 
- The container uses `host.docker.internal` to access the RPC node running on the host
- RPC credentials in `.env` must match those in your `palladium.conf` file
- Make sure your Palladium node is fully synchronized before starting the API

## 🐳 Docker Commands

```bash
# Start the API
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop the API
docker-compose down

# Complete rebuild
docker-compose down && docker-compose up --build -d
```

## 🔧 Technical Notes

- **Architecture**: API runs in Docker container, connects to Palladium node on host
- **Framework**: Built with FastAPI for automatic documentation and validation
- **Network**: Container configured to access host RPC via `host.docker.internal`
- **Compatibility**: Automatic fallbacks for different Palladium node configurations
- **Port**: Default API port is 8032
- **Format**: All responses are in JSON format
- **Dependencies**: Requires active Palladium node with RPC server enabled