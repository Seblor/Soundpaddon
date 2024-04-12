console.log('object');

import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch-commonjs';
import injectSocketIO from './socketIoHandler';
import nodeSea from 'node:sea'
import { registerRoutes } from './routes/index';
import { createTray } from './add-system-tray';
// import { handler } from '../../build/handler.js';

if (nodeSea.isSea()) {
  const trayExeAsset = nodeSea.getRawAsset('tray_windows_release.exe')
  const NHCWAsset = nodeSea.getRawAsset('node-hide-console-window.node')

  fs.mkdirSync(path.join(__dirname, 'traybin'), { recursive: true })
  if (typeof trayExeAsset === 'string') {
    fs.writeFileSync(path.join(__dirname, 'traybin/tray_windows_release.exe'), trayExeAsset)
  } else {
    fs.writeFileSync(path.join(__dirname, 'traybin/tray_windows_release.exe'), Buffer.from(new Uint8Array(trayExeAsset)))
  }

  if (typeof NHCWAsset === 'string') {
    fs.writeFileSync(path.join(__dirname, 'traybin/node-hide-console-window.node'), NHCWAsset)
  } else {
    fs.writeFileSync(path.join(__dirname, 'traybin/node-hide-console-window.node'), Buffer.from(new Uint8Array(NHCWAsset)))
  }
}

createTray()


// const keyUrl = 'http://local-ip.co/cert/server.pem'
// const certUrl = 'http://local-ip.co/cert/server.key'
const keyUrl = 'https://local-ip.sh/server.pem'
const certUrl = 'https://local-ip.sh/server.key'

await Promise.all([
  downloadFile(keyUrl, 'ssl/server.key'),
  downloadFile(certUrl, 'ssl/server.pem'),
])

// const handlerPath = '../../build/handler.js'
// const handler = (await import(handlerPath)).handler;

const app = express();
const server = https.createServer({
  key: fs.readFileSync('ssl/server.pem'),
  cert: fs.readFileSync('ssl/server.key'),
}, app);

// Inject SocketIO
injectSocketIO(server);

app.use(cors({
  origin: /(.*\.)?soundpaddon.app|.*\.my\.local-ip\.co:.*|.*.local-ip\.sh:.*/,
  methods: ['OPTIONS', 'POST', 'GET'],
  maxAge: 2592000,
}))

// SvelteKit handlers
// app.use(handler);

registerRoutes(app);

server.listen(8555, () => {
  console.log('Running on http://localhost:8555');
});

function downloadFile(url: string, targetPath: string): Promise<void> {
  if (!fs.existsSync(path.join(targetPath, '..'))) {
    fs.mkdirSync(path.join(targetPath, '..'), { recursive: true })
  }
  return new Promise((resolve, reject) => {
    fetch(url).then(res => {
      const dest = fs.createWriteStream(targetPath);
      if (res.body === null) {
        reject(new Error('Response body is null'))
        return
      }
      res.body.pipe(dest);
      dest.on('finish', () => {
        dest.close()
        resolve()
      });
    })
  })
}
