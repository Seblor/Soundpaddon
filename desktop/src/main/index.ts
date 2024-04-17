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
}): Promise<https.Server> {
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
    extensions: ['html']
  }));
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'index.html'));
  });

  // SvelteKit handlers
  // app.use(handler);

  const server = https.createServer({
    key: fs.readFileSync(path.join(certificateRootPath, 'server.pem')),
    cert: fs.readFileSync(path.join(certificateRootPath, 'server.key')),
  }, app)

  // Inject SocketIO
  injectSocketIO(server);

  return server
}

export function setSystemTray(app: App, iconPath: string) {
  createTray(app, iconPath)
}
