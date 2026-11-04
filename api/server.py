#!/usr/bin/env python3
"""Minimal read-only API for the Palladium site: palladiumd RPC + Fulcrum peers.

Stdlib only. Endpoints keep the response shapes the site JS already expects.
"""
import base64
import hmac
import json
import os
import socket
import ssl
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.request import Request, urlopen

RPC_URL = os.getenv('RPC_URL', 'http://docker-palladiumcore:2332')
RPC_USER = os.getenv('RPC_USER', '')
RPC_PASSWORD = os.getenv('RPC_PASSWORD', '')
FULCRUM_HOST = os.getenv('FULCRUM_HOST', 'plm-fulcrum')
FULCRUM_TCP_PORT = int(os.getenv('FULCRUM_TCP_PORT', '50001'))
FULCRUM_SSL_PORT = int(os.getenv('FULCRUM_SSL_PORT', '50002'))
# Public name of our own Fulcrum, listed first in /api/electrumx/servers (optional).
FULCRUM_PUBLIC_HOST = os.getenv('FULCRUM_PUBLIC_HOST', '')
API_KEY = os.getenv('API_KEY', '')
PORT = int(os.getenv('PORT', '8080'))
CACHE_TTL = int(os.getenv('CACHE_TTL', '10'))
SERVERS_TTL = int(os.getenv('SERVERS_TTL', '120'))

_cache = {}


def cached(key, ttl, fn):
    hit = _cache.get(key)
    if hit and time.time() - hit[0] < ttl:
        return hit[1]
    value = fn()
    _cache[key] = (time.time(), value)
    return value


def rpc(method, params=None):
    auth = base64.b64encode(f'{RPC_USER}:{RPC_PASSWORD}'.encode()).decode()
    body = json.dumps({'jsonrpc': '1.0', 'id': 'api', 'method': method, 'params': params or []}).encode()
    req = Request(RPC_URL, body, {'Content-Type': 'application/json', 'Authorization': f'Basic {auth}'})
    with urlopen(req, timeout=10) as r:
        return json.load(r)['result']


# ---- Fulcrum / Electrum peers ----

def electrum_call(method, params=None, timeout=5):
    with socket.create_connection((FULCRUM_HOST, FULCRUM_TCP_PORT), timeout=timeout) as s:
        s.sendall((json.dumps({'id': 1, 'method': method, 'params': params or []}) + '\n').encode())
        buf = b''
        while not buf.endswith(b'\n'):
            chunk = s.recv(65536)
            if not chunk:
                break
            buf += chunk
    return json.loads(buf)['result']


def port_open(host, port, use_ssl=False, timeout=2.0):
    try:
        with socket.create_connection((host, port), timeout=timeout) as s:
            if use_ssl:
                ctx = ssl.create_default_context()
                ctx.check_hostname = False
                ctx.verify_mode = ssl.CERT_NONE  # reachability only; many servers are self-signed
                ctx.wrap_socket(s, server_hostname=host).close()
        return True
    except OSError:
        return False


def probe(server):
    host = server['host']
    server['tcp_reachable'] = bool(server['tcp_port']) and port_open(host, server['tcp_port'])
    server['ssl_reachable'] = bool(server['ssl_port']) and port_open(host, server['ssl_port'], True)
    return server


def load_servers():
    found = {}
    if FULCRUM_PUBLIC_HOST:
        found[FULCRUM_PUBLIC_HOST] = {'host': FULCRUM_PUBLIC_HOST, 'tcp_port': FULCRUM_TCP_PORT, 'ssl_port': FULCRUM_SSL_PORT}
    try:
        # peers entry: [ip, hostname, ["v1.4", "s50002", "t50001", ...]]
        for _ip, host, feats in electrum_call('server.peers.subscribe'):
            tcp = next((int(f[1:] or 50001) for f in feats if f[:1] == 't'), None)
            ssl_p = next((int(f[1:] or 50002) for f in feats if f[:1] == 's'), None)
            found.setdefault(host, {'host': host, 'tcp_port': tcp, 'ssl_port': ssl_p})
    except (OSError, ValueError, KeyError):
        pass
    with ThreadPoolExecutor(max_workers=16) as ex:
        return list(ex.map(probe, found.values()))


def ts():
    return datetime.now().isoformat()


ROUTES = {
    '/api/palladium/block-height': lambda: {'block_height': int(cached('h', CACHE_TTL, lambda: rpc('getblockcount')))},
    '/api/palladium/network-hashrate': lambda: {'network_hashrate': float(cached('hr', CACHE_TTL, lambda: rpc('getnetworkhashps'))), 'unit': 'H/s'},
    '/api/palladium/difficulty': lambda: {'difficulty': float(cached('d', CACHE_TTL, lambda: rpc('getdifficulty')))},
    '/api/palladium/peers': lambda: {'peers': cached('p', CACHE_TTL, lambda: [
        {'addr': p.get('addr', ''), 'inbound': p.get('inbound', False), 'version': p.get('subver', ''),
         'conntime': p.get('conntime', 0), 'bytessent': p.get('bytessent', 0), 'bytesrecv': p.get('bytesrecv', 0)}
        for p in rpc('getpeerinfo')])},
    '/api/electrumx/servers': lambda: (lambda s: {'servers': s, 'total': len(s)})(cached('s', SERVERS_TTL, load_servers)),
    '/api/health': lambda: {'status': 'ok'},
}


class Handler(BaseHTTPRequestHandler):
    def _send(self, code, payload):
        body = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        # Dev: the browser calls this API directly from another origin.
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'X-API-Key')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send(204, {})

    def do_GET(self):
        path = self.path.split('?')[0]
        route = ROUTES.get(path)
        if not route:
            return self._send(404, {'error': 'not found'})
        if path != '/api/health' and API_KEY and not hmac.compare_digest(self.headers.get('X-API-Key', ''), API_KEY):
            return self._send(401, {'error': 'unauthorized'})
        try:
            self._send(200, {**route(), 'timestamp': ts()})
        except Exception as e:  # RPC down, bad credentials, ...
            print(f'{path} error: {e}', flush=True)
            self._send(502, {'error': 'upstream error'})

    def log_message(self, *args):
        pass


if __name__ == '__main__':
    ThreadingHTTPServer(('0.0.0.0', PORT), Handler).serve_forever()
