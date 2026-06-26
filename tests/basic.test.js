import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('RTCMultiConnection', () => {
  let RTCMultiConnection;

  beforeAll(() => {
    const bundlePath = join(__dirname, '..', 'dist', 'RTCMuiConnection.js');
    const bundle = readFileSync(bundlePath, 'utf8');

    // Execute in global scope via Function() so var declarations leak to window
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost/',
      runScripts: 'dangerously',
    });
    const fn = dom.window.Function(
      'module', 'exports', 'require',
      bundle + '; return (typeof module !== "undefined" && module.exports) ? module.exports : RTCMultiConnection;'
    );
    RTCMultiConnection = fn.call(dom.window, undefined, undefined, undefined);
  });

  it('exports a constructor function', () => {
    expect(typeof RTCMultiConnection).toBe('function');
  });

  it('creates an instance with new()', () => {
    const conn = new RTCMultiConnection();
    expect(conn).toBeDefined();
  });

  it('has expected public methods on connection object', () => {
    const conn = new RTCMultiConnection();
    expect(typeof conn.open).toBe('function');
    expect(typeof conn.join).toBe('function');
    expect(typeof conn.leave).toBe('function');
    expect(typeof conn.send).toBe('function');
    expect(typeof conn.disconnect).toBe('function');
    expect(typeof conn.close).toBe('function');
  });

  it('has session configuration object with audio and video defaults', () => {
    const conn = new RTCMultiConnection();
    expect(conn.session).toBeDefined();
    expect(typeof conn.session.audio).toBe('boolean');
    expect(typeof conn.session.video).toBe('boolean');
    expect(conn.session.audio).toBe(true);
    expect(conn.session.video).toBe(true);
  });

  it('accepts data-only session mode', () => {
    const conn = new RTCMultiConnection();
    conn.session = { data: true };
    expect(conn.session.data).toBe(true);
  });

  it('has attachStreams array property', () => {
    const conn = new RTCMultiConnection();
    expect(Array.isArray(conn.attachStreams)).toBe(true);
  });

  it('has streamEvents object property', () => {
    const conn = new RTCMultiConnection();
    expect(typeof conn.streamEvents).toBe('object');
  });

  it('has peers object property', () => {
    const conn = new RTCMultiConnection();
    expect(typeof conn.peers).toBe('object');
  });

  it('has codecs, bandwidth, and sdpConstraints properties', () => {
    const conn = new RTCMultiConnection();
    expect(typeof conn.codecs).toBe('object');
    expect(typeof conn.bandwidth).toBe('object');
    expect(typeof conn.sdpConstraints).toBe('object');
  });

  it('has userid generated on construction', () => {
    const conn = new RTCMultiConnection();
    expect(typeof conn.userid).toBe('string');
    expect(conn.userid.length).toBeGreaterThan(0);
  });

  it('has channel set from roomid argument', () => {
    const conn = new RTCMultiConnection('test-room-123');
    expect(conn.channel).toBe('test-room-123');
  });
});
