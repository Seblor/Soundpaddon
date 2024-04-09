import { Server } from 'socket.io';
import { Server as HttpServer } from 'node:http';
import onWebsocketConnection from './websocket-server.js';

export default function injectSocketIO(server: HttpServer) {
    const io = new Server(server);

    io.on('connection', onWebsocketConnection);

    console.log('SocketIO injected');
}
