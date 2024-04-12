import type { Application, Request, Response } from 'express';
import { networkInterfaces } from 'os'
import bodyParser from 'body-parser'

const nets = networkInterfaces();

export default function registerRoutes(app: Application) {
  app.get('/api/data', bodyParser.text(), async function (req: Request, res: Response) {
    const localIPs = Object.values(nets).flat().filter(net => net && net.family === 'IPv4' && !net.address.startsWith('127')).map(net => net?.address)
    return res.send(JSON.stringify({ localIPs }))
  })
}
