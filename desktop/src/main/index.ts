import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import injectSocketIO from './socketIoHandler';
import { registerRoutes } from './routes/index';
import { createTray } from './add-system-tray';
import { type App } from 'electron/main';
import { downloadFile } from './utils/misc';

// const keyUrl = 'http://local-ip.co/cert/server.pem'
// const certUrl = 'http://local-ip.co/cert/server.key'
const keyUrl = 'https://local-ip.sh/server.pem'
const certUrl = 'https://local-ip.sh/server.key'

export async function createHttpServer({
  certificateRootPath,
  pathToServe,
  electronApp,
}: {
  certificateRootPath: string
  pathToServe: string
  electronApp: App
}): Promise<void> {
  await Promise.all([
    downloadFile(keyUrl, path.join(certificateRootPath, 'server.key')),
    downloadFile(certUrl, path.join(certificateRootPath, 'server.pem')),
  ])

  const app = express();

  app.use(cors({
    origin: /(.*\.)?soundpaddon.app|.*\.my\.local-ip\.co:.*|.*.local-ip\.sh:.*|.*/,
    methods: ['OPTIONS', 'POST', 'GET'],
    credentials: true,
    maxAge: 2592000,
  }))

  registerRoutes(app, electronApp);

  app.use(express.static(pathToServe, {
    redirect: false,
    extensions: ['html']
  }));
  app.get('*', function (request, response) {
    console.log(path.resolve(__dirname, 'index.html'));
    response.sendFile(path.resolve(__dirname, 'index.html'));
  });

  // SvelteKit handlers
  // app.use(handler);

  const httpsServer = https.createServer({
    key: fs.readFileSync(path.join(certificateRootPath, 'server.pem')),
    cert: fs.readFileSync(path.join(certificateRootPath, 'server.key')),
  }, app)

  const httpServer = http.createServer(app)

  // Inject SocketIO
  injectSocketIO(httpsServer);
  injectSocketIO(httpServer);

  await Promise.all([
    new Promise(resolve => {
      httpsServer
        .listen(8555)
        .once('listening', resolve)
    }),
    new Promise(resolve => {
      httpServer
        .listen(8556)
        .once('listening', resolve)
    })
  ])
}

export function setSystemTray(app: App, iconPath: string) {
  createTray(app, iconPath)
}
