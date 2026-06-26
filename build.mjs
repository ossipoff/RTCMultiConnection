import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));
const VERSION = pkg.version;

const BANNER = `'use strict';

// Last time updated: ${new Date().toISOString()}

// _________________________
// RTCMultiConnection v${VERSION}

// Open-Sourced: https://github.com/muaz-khan/RTCMultiConnection

// --------------------------------------------------
// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// --------------------------------------------------

`;

function injectConfig(text) {
  const configPath = join(__dirname, 'config.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));

  let result = text;
  for (const [key, value] of Object.entries(config)) {
    result = result.replaceAll(`@@${key}`, String(value));
  }
  result = result.replaceAll('@@version', VERSION);

  return result;
}

async function buildBundle(minify) {
  // Concatenate all source files in the same order as Gruntfile.js
  const srcFiles = [
    'dev/head.js',
    'dev/amd.js',
    'dev/SocketConnection.js',
    'dev/MultiPeersHandler.js',
    'node_modules/detectrtc/DetectRTC.js',
    'dev/globals.js',
    'dev/ios-hacks.js',
    'dev/RTCPeerConnection.js',
    'dev/CodecsHandler.js',
    'dev/OnIceCandidateHandler.js',
    'dev/IceServersHandler.js',
    'dev/getUserMedia.js',
    'dev/StreamsHandler.js',
    'dev/TextSenderReceiver.js',
    'dev/FileProgressBarHandler.js',
    'dev/TranslationHandler.js',
    'dev/RTCMultiConnection.js',
    'dev/tail.js',
  ];

  const rawSource = BANNER + srcFiles.map(f => readFileSync(join(__dirname, f), 'utf8')).join('\n');

  // Use esbuild transform API to minify raw text directly (not via IIFE bundling)
  if (minify) {
    const result = await esbuild.transform(rawSource, {
      loader: 'js',
      minify: true,
      sourcemap: false,
      target: ['es2015'],
      platform: 'browser',
    });
    return result.code;
  } else {
    return rawSource;
  }
}

// Ensure dist directory exists
mkdirSync(join(__dirname, 'dist'), { recursive: true });

console.log('Building unminified bundle...');
let unminified = await buildBundle(false);
unminified = injectConfig(unminified);
writeFileSync(join(__dirname, 'dist', 'RTCMuiConnection.js'), unminified, 'utf8');
console.log(`  -> dist/RTCMuiConnection.js (${(unminified.length / 1024).toFixed(1)} KB)`);

console.log('Building minified bundle...');
let minified = await buildBundle(true);
minified = injectConfig(minified);
writeFileSync(join(__dirname, 'dist', 'RTCMuiConnection.min.js'), minified, 'utf8');
console.log(`  -> dist/RTCMuiConnection.min.js (${(minified.length / 1024).toFixed(1)} KB)`);

console.log(`Built RTCMultiConnection v${VERSION}`);
