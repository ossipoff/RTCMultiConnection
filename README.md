![](https://i.imgur.com/MFfRBSM.png)

# RTCMultiConnection - WebRTC JavaScript Library

[![npm](https://img.shields.io/npm/v/rtcmulticonnection.svg)](https://npmjs.org/package/rtcmulticonnection) [![downloads](https://img.shields.io/npm/dm/rtcmulticonnection.svg)](https://npmjs.org/package/rtcmulticonnection) [![npm-audit](https://img.shields.io/badge/npm--audit-0%20vulnerabilities-brightgreen)](https://github.com/ossipoff/RTCMultiConnection/security/code-scanning?query=is%3Aopen+sort%3Aupdated-desc)

> RTCMultiConnection is a WebRTC JavaScript library for peer-to-peer applications (screen sharing, audio/video conferencing, file sharing, media streaming etc.)

## Socket.io Signaling Server

Signaling server has a separate repository:

* https://github.com/muaz-khan/RTCMultiConnection-Server

## Demos

* https://muazkhan.com:9001/demos/

## Getting Started Without Any Installation

* https://www.rtcmulticonnection.org/docs/getting-started/

## YouTube Channel

* https://www.youtube.com/playlist?list=PLPRQUXAnRydKdyun-vjKPMrySoow2N4tl

## Install On Your Own Website

* https://github.com/muaz-khan/RTCMultiConnection/tree/master/docs/installation-guide.md

```sh
mkdir demo && cd demo

# install from NPM
npm install rtcmulticonnection

# or clone from github
git clone https://github.com/muaz-khan/RTCMultiConnection.git ./

# install all required packages
# you can optionally include --save-dev
npm install

node server --port=9001
```

## Integrate Inside Any Nodejs Application

* https://github.com/muaz-khan/RTCMultiConnection-Server/wiki/Integrate-inside-nodejs-applications

## `Config.json` Explained

* https://github.com/muaz-khan/RTCMultiConnection-Server/wiki/config.json

## How to Enable HTTPs?

* https://github.com/muaz-khan/RTCMultiConnection-Server/wiki/How-to-Enable-HTTPs

## Want to Contribute?

RTCMultiConnection uses `esbuild` to bundle JavaScript from `dev/` into `dist/`:

```sh
npm install
npm run build          # Build bundles
npm run build:watch    # Auto-rebuild on dev/*.js changes
npm test               # Run tests
npm lint               # Lint check (warnings only, no errors)
```

See [CONTRIBUTING.md](https://github.com/muaz-khan/RTCMultiConnection/blob/master/CONTRIBUTING.md) for full instructions.

## Wiki Pages

1. https://github.com/muaz-khan/RTCMultiConnection/wiki
2. https://github.com/muaz-khan/RTCMultiConnection-Server/wiki

## License

[RTCMultiConnection](https://github.com/muaz-khan/RTCMultiConnection) is released under [MIT licence](https://github.com/muaz-khan/RTCMultiConnection/blob/master/LICENSE.md) . Copyright (c) [Muaz Khan](https://MuazKhan.com/).
