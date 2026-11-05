import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import express from 'express';
import cors from 'cors';
import injectSocketIO from './socketIoHandler';
import { registerRoutes } from './routes/index';
import { createTray } from './add-system-tray';
import { type App } from 'electron/main';
import { downloadFile } from './utils/misc';

const keyUrl = 'https://local.soundpaddon.app/server.pem'
const certUrl = 'https://local.soundpaddon.app/server.key'

export class PortBindingError extends Error {
  constructor(public readonly port: number, public readonly processName: string | null, public readonly errorCode: string) {
    super(
      processName
        ? `Port ${port} is already in use by ${processName}.`
        : `Port ${port} could not be bound.`
    )
    this.name = 'PortBindingError'
  }
}

async function getPortProcessName(port: number): Promise<string | null> {
  return await new Promise((resolve) => {
    execFile(
      'powershell.exe',
      [
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        `Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty OwningProcess | ForEach-Object { try { (Get-Process -Id $_ -ErrorAction Stop).ProcessName } catch { $_ } }` ,
      ],
      { windowsHide: true },
      (error, stdout) => {
        const processName = String(stdout ?? '').trim()
        if (error || !processName) {
          resolve(null)
          return
        }

        resolve(processName || null)
      }
    )
  })
}

function listenOnPort(server: http.Server | https.Server, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onError = (error: Error & { code?: string }) => {
      server.removeListener('listening', onListening)
      reject(error)
    }

    const onListening = () => {
      server.removeListener('error', onError)
      resolve()
    }

    server.once('error', onError)
    server.once('listening', onListening)
    server.listen(port)
  })
}

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

  try {
    await Promise.all([
      listenOnPort(httpsServer, 8555),
      listenOnPort(httpServer, 8556),
    ])
  } catch (error) {
    const bindingError = error as (NodeJS.ErrnoException & { port?: number })

    const port = bindingError?.port ?? 8555
    const processName = bindingError?.code === 'EACCES' || bindingError?.code === 'EADDRINUSE'
      ? await getPortProcessName(port)
      : null

    throw new PortBindingError(port, processName, bindingError?.code ?? 'UNKNOWN')
  }
}

export function setSystemTray(app: App, iconPath: string) {
  createTray(app, iconPath)
}
