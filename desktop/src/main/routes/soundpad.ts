import bodyParser from 'body-parser';
import { type Application, type Request, type Response, } from 'express';
import Soundpad from 'soundpad.js'

const soundpadClient = new Soundpad({
  autoReconnect: true,
  startSoundpadOnConnect: true,
})

soundpadClient.connect()

export default function registerRoutes(app: Application) {
  app.post('/api/soundpad', bodyParser.text(), async function (req: Request, res: Response) {
    const data = req.body;

    return res.send(await soundpadClient.sendQuery(data))
  })

  app.options('/api/soundpad', bodyParser.text(), async function (req: Request, res: Response) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '600',
    }
    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value)
    }
    return res
  })
}
