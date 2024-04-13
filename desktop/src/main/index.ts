import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch-commonjs';
import injectSocketIO from './socketIoHandler';
import { registerRoutes } from './routes/index';
import { createTray } from './add-system-tray';
import type { App } from 'electron/main';

// const keyUrl = 'http://local-ip.co/cert/server.pem'
// const certUrl = 'http://local-ip.co/cert/server.key'
const keyUrl = 'https://local-ip.sh/server.pem'
const certUrl = 'https://local-ip.sh/server.key'

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

export async function createHttpServer({
  certificateRootPath,
  pathToServe,
}: {
  certificateRootPath: string
  pathToServe: string
}): Promise<https.Server> {
  await Promise.all([
    downloadFile(keyUrl, path.join(certificateRootPath, 'ssl/server.key')),
    downloadFile(certUrl, path.join(certificateRootPath, 'ssl/server.pem')),
  ])

  const app = express();

  registerRoutes(app);

  app.use(express.static(pathToServe, {
    extensions: ['html']
  }));
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'index.html'));
  });

  app.use(cors({
    origin: /(.*\.)?soundpaddon.app|.*\.my\.local-ip\.co:.*|.*.local-ip\.sh:.*/,
    methods: ['OPTIONS', 'POST', 'GET'],
    maxAge: 2592000,
  }))

  // SvelteKit handlers
  // app.use(handler);

  const server = https.createServer({
    key: fs.readFileSync(path.join(certificateRootPath, 'ssl/server.pem')),
    cert: fs.readFileSync(path.join(certificateRootPath, 'ssl/server.key')),
  }, app)

  // Inject SocketIO
  injectSocketIO(server);

  return server
}

export function setSystemTray(app: App, iconPath: string) {
  createTray(app, iconPath)
}
