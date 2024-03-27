import http from 'http';
import express from 'express';
import injectSocketIO from './socketIoHandler.js';
// import { handler } from '../../build/handler.js';

const handlerPath = '../../build/handler.js'
const handler = (await import(handlerPath)).handler;

const app = express();
const server = http.createServer(app);

// Inject SocketIO
injectSocketIO(server);

// SvelteKit handlers
app.use(handler);

server.listen(3000, () => {
    console.log('Running on http://localhost:3000');
});
