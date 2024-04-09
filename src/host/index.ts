import https from 'node:https';
import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import injectSocketIO from './socketIoHandler.js';
import './add-system-tray.js'
// import { handler } from '../../build/handler.js';

const keyUrl = 'http://local-ip.co/cert/server.pem';
const certUrl = 'http://local-ip.co/cert/server.key'

await Promise.all([
  downloadFile(keyUrl, 'ssl/server.key'),
  downloadFile(certUrl, 'ssl/server.pem'),
])

const handlerPath = '../../build/handler.js'
const handler = (await import(handlerPath)).handler;

const app = express();
const server = https.createServer({
  key: fs.readFileSync('ssl/server.pem'),
  cert: fs.readFileSync('ssl/server.key'),
}, app);

// Inject SocketIO
injectSocketIO(server);

app.use(cors({
  origin: /(.*\.)?soundpaddon.app|.*\.my\.local-ip\.co:8555/,
  methods: ['OPTIONS', 'POST', 'GET'],
  maxAge: 2592000,
}))

// SvelteKit handlers
app.use(handler);

server.listen(8555, () => {
  console.log('Running on http://localhost:8555');
});

function downloadFile(url: string, targetPath: string): Promise<void> {
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
