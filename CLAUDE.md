# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RTCMultiConnection is a WebRTC JavaScript library that wraps `RTCPeerConnection` to support peer-to-peer features: screen sharing, audio/video conferencing, file sharing, media streaming, and more. It supports multiple signaling transports (Socket.io, Firebase, PubNub, SignalR, SSE, WebSocket, XHR, WebSync, Sip).

Version: 3.7.0 | License: MIT

## Directory Structure

- **`dev/`** — Source modules (36 JS files). These are concatenated by Grunt into the distribution bundle. Never edit files in `dist/` directly.
- **`dist/`** — Generated output (`RTCMultiConnection.js`, `RTCMultiConnection.min.js`). Produced by `grunt`.
- **`demos/`** — Standalone HTML demo pages showing various use cases (video conferencing, screen sharing, file sharing, broadcast, etc.). Also contains `dashboard/` subdirectory for the full dashboard demo.
- **`admin/`** — Admin UI for the signaling server.
- **`docs/`** — Documentation (installation guide, getting started, upgrade notes, tips/tricks).
- **`fake-keys/`** — Self-signed SSL keys for local HTTPS testing.
- **`server.js`** — Node.js signaling server entry point (HTTP + Socket.io). Depends on `rtcmulticonnection-server`.
- **`config.json`** — Server configuration (port, socket URL, SSL paths, admin credentials).

## Build Process

```sh
npm install          # Install dependencies (Grunt 0.4.5 ecosystem)
grunt                # Compile: concat -> replace config -> beautify -> uglify -> copy -> clean
grunt watch          # Auto-recompile on dev/*.js changes
```

The Grunt build pipeline in `Gruntfile.js`:
1. **concat** — concatenates modules from `dev/` in order defined in `grunt.initConfig.concat.dist.src` (see `head.js`, `amd.js`, connection handlers, core handlers, `RTCMultiConnection.js`, `tail.js`)
2. **replace** — injects values from `config.json` and version number into the bundle
3. **jsbeautifier** — formats output with 4-space indent
4. **uglify** — minifies to `dist/RTCMultiConnection.min.js`
5. **copy** — copies unminified bundle to `dist/RTCMultiConnection.js`
6. **clean** — removes temp files

To add a new module, insert its path into the `src` array in `Gruntfile.js` before `RTCMultiConnection.js`.

## Running the Dev Server

```sh
npm start            # Runs server.js on port 9001 (default)
node server --port=8080   # Custom port via bash parameter
```

The server serves static files from the repo root, proxies signaling via Socket.io at `/socket.io/`, and reads config from `config.json`. Set `enableAdmin: true` in `config.json` to expose the admin UI at `/admin/`.

## Core Architecture

### Entry Point & Public API

- **`dev/RTCMultiConnection.js`** — The main class. Constructor takes `(roomid, forceOptions)`. Creates an internal `MultiPeers` instance that handles all peer management. Exposes the public API through the `connection` object.
- **`dev/head.js`** / **`dev/tail.js`** — IIFE wrapper + AMD/CommonJS exports.
- **`dev/amd.js`** — UMD boilerplate.

### Signaling Transports (replaceable)

Each transport implements the same socket interface (`on`, `emit`). Swap by editing the demo or replacing the import:

| File | Transport |
|------|-----------|
| `SocketConnection.js` | Socket.io (default) |
| `FirebaseConnection.js` | Firebase Realtime DB |
| `PubNubConnection.js` | PubNub |
| `SignalRConnection.js` | SignalR |
| `SSEConnection.js` | Server-Sent Events |
| `WebSocketConnection.js` | Raw WebSocket |
| `WebSyncConnection.js` | WebSync |
| `XHRConnection.js` | XHR-polling |
| `SipConnection.js` | SIP |
| `BluetoothConnection.js` | Bluetooth |

### Core Handlers

| Handler | Purpose |
|---------|---------|
| `MultiPeersHandler.js` | Peer lifecycle, room join/leave, connection management |
| `StreamsHandler.js` | Media stream type detection and event handling |
| `RTCPeerConnection.js` | Low-level RTCPeerConnection abstraction |
| `OnIceCandidateHandler.js` | ICE candidate exchange |
| `IceServersHandler.js` | STUN/TURN server configuration |
| `CodecsHandler.js` | Codec selection (H264, opus, etc.) |
| `getUserMedia.js` | Camera/microphone capture |
| `MediaStreamRecorder.js` | Media recording via RecordRTC |
| `RecordingHandler.js` | Recording session management |
| `TextSenderReceiver.js` | Data channel text messaging |
| `FileSelector.js` / `FileProgressBarHandler.js` | File transfer UI |
| `TranslationHandler.js` | Real-time translation |
| `BandwidthHandler.js` | Bandwidth estimation/throttling |
| `StreamHasData.js` | Stream readiness checks |
| `MultiStreamsMixer.js` | Combining multiple media streams |
| `enableV2Api.js` | V2 API compatibility layer |

### Key Patterns

- **Session types** are set via `connection.session = { audio: true, video: true, data: true, screen: true }`. Only one of `audio`/`video`/`screen` can be active at a time.
- **Room model**: `connection.open(roomId)` creates/joins a room; `connection.join(roomId)` joins an existing room. Peers auto-discover each other through the signaling transport.
- **Events**: `onstream`, `onLeave`, `onClose`, `open`, `error` — all fired on the `connection` object.
- **Broadcast mode**: Set `connection.session.broadcast = true` for one-to-many streaming (hub-and-spoke relay).
- **Scalable broadcast**: Enable with `connection.enableScalableBroadcast = true` and configure `maxRelayLimitPerUser`.

## Demos

Located in `demos/`. Each is a self-contained HTML page that loads the library from `/dev/RTCMultiConnection.js` or `/dist/`:

| Demo | Use Case |
|------|----------|
| `video-conferencing.html` | Many-to-many video calls |
| `dashboard/` | Full dashboard + conferencing + chat + file sharing |
| `screen-sharing.html` | Screen capture distribution |
| `video-broadcasting.html` | One-to-many video |
| `file-sharing.html` | Peer file transfer |
| `audio-conferencing.html` | Audio-only meetings |
| `one-to-one.html` | Simple 1:1 call |
| `Scalable-Broadcast.html` | Scalable broadcasting |
| `vuejs-video-conferencing.html` | Vue.js integration example |

## Testing

```sh
node npm-test.js    # Basic smoke test (requires rtcmulticonnection installed)
```

The test creates a connection, sets data-only session mode, opens a room, and verifies the API responds. No formal test framework is used — this is a manual smoke test for Tonic/npm environments.

## Contributing

See `CONTRIBUTING.md` for full instructions. Key steps:
1. Edit files in `dev/`, not `dist/`
2. Run `grunt` to rebuild
3. Test via local server (`npm start`) + demo pages
4. Submit PR against `master`
