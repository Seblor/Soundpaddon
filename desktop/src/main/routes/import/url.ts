import bodyParser from 'body-parser';
import { type Application, type Request, type Response, } from 'express';
import { App } from 'electron/main';
import path from 'node:path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { importToSoundpad, timeMarkToSeconds } from '../../utils/misc';

ffmpeg.setFfmpegPath(ffmpegInstaller.path.replace('app.asar', 'app.asar.unpacked'))

const responsesToUpdate: Array<(newProgress: number, isDone: boolean) => void> = [];

export default function registerRoutes(app: Application, electronApp: App) {
  app.post('/api/import/url', bodyParser.json(), async function (req: Request, res: Response) {
    const data = req.body as {
      url: string,
    };

    const outputPath = path.join(electronApp.getPath('userData'), 'sounds', path.basename(data.url).replace(/\.[^/.]+$/, '') + '.mp3');

    await new Promise(resolve => {
      ffmpeg(data.url)
        .audioBitrate(128)
        .on('progress', (progress) => {
          responsesToUpdate.forEach(listener => listener(timeMarkToSeconds(progress.timemark), false));
        })
        .on('end', resolve)
        .save(outputPath);
    })

    await importToSoundpad(outputPath);

    return res.end()
  })

  app.get('/api/import/url/progress', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    const listener = (newProgress: number, isDone: boolean) => {
      if (isDone) {
        res.write(`data: ${newProgress}\n\n`);
        responsesToUpdate.splice(responsesToUpdate.indexOf(listener), 1);
        res.end();
      } else {
        res.write(`data: ${newProgress}\n\n`);
      }
    }

    responsesToUpdate.push(listener);

    // If client closes connection, stop sending events
    res.on('close', () => {
      responsesToUpdate.splice(responsesToUpdate.indexOf(listener), 1);
      res.end();
    });
  });
}
