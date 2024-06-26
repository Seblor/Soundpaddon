import { Server } from 'socket.io'
import '../host/add-system-tray'

// === socket.io setup for development ===

import onWebsocketConnection from '../host/websocket-server';

export function devSocketSetup() {
  console.log('[DEV] Starting to listen for socket connections');
  const webSocketServer = {
    name: 'webSocketServer',
    configureServer(server: any) {
      if (!server.httpServer) return

      const io = new Server(server.httpServer)

      io.on('connection', onWebsocketConnection)
      io.on('disconnect', () => {
        console.log('Client disconnected')
      })
    }
  }

  return webSocketServer
}
