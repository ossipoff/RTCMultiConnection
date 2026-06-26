import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

// Expose DOM globals on test context
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  navigator: Object.assign(dom.window.navigator, { getUserMedia: () => {} }),
  location: dom.window.location,
  console,
});

// Mock WebRTC APIs
globalThis.RTCPeerConnection = class RTCPeerConnection {
  constructor() {}
  createOffer() { return Promise.resolve({ type: 'offer' }); }
  createAnswer() { return Promise.resolve({ type: 'answer' }); }
  setLocalDescription() { return Promise.resolve(); }
  setRemoteDescription() { return Promise.resolve(); }
  addIceCandidate() { return Promise.resolve(); }
};
globalThis.MediaStream = class MediaStream {
  getTracks() { return []; }
  stop() {}
};
globalThis.RTCSessionDescription = class RTCSessionDescription {
  constructor(desc) { this.type = desc?.type || ''; }
};
globalThis.RTCIceCandidate = class RTCIceCandidate {
  constructor(candidate) { this.candidate = candidate || ''; }
};
// crypto is provided by Node built-in; only override if missing
if (!globalThis.crypto) {
  globalThis.crypto = { getRandomValues: (arr) => arr };
}
