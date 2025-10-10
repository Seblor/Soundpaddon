import bodyParser from 'body-parser';
import { type Application, type Request, type Response, } from 'express';
import { App } from 'electron/main';
import path from 'node:path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import fs from 'node:fs';
import { importToSoundpad, timeMarkToSeconds } from '../../utils/misc';
import { getDownloadLocation } from '../../download-location-tray-option';
import { getYtDlpWrapper, updateYTDlp } from '../../utils/yt-dlp';

updateYTDlp();

ffmpeg.setFfmpegPath(ffmpegInstaller.path.replace('app.asar', 'app.asar.unpacked'))

const responsesToUpdate: Array<(data: { stepName: string, progress: number, isDone: boolean }[]) => void> = [];

export default function registerRoutes (app: Application, electronApp: App) {
  app.post('/api/import/youtube', bodyParser.json(), async function (req: Request, res: Response) {
    const data = req.body as {
      url: string,
      name: string,
      start: number,
      duration: number,
    };

    const statuses = [
      { stepName: 'Initializing', progress: -1, isDone: false },
      { stepName: 'Downloading', progress: 0, isDone: false },
      { stepName: 'Converting', progress: 0, isDone: false },
      { stepName: 'Cleaning Up', progress: 0, isDone: false },
    ]

    responsesToUpdate.forEach(listener => listener(statuses));

    const outputPath = path.join(getDownloadLocation(electronApp), `${data.name}.mp3`);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });


    /**
     * Download with yt-dlp
     */
    await new Promise<void>(resolve => {
      getYtDlpWrapper()
        .exec([
          data.url,
          '-f',
          'bestaudio',
          '-o',
          `temp_${data.name}`,
        ], {
          cwd: electronApp.getPath('temp'),
        })
        .on('progress', (progress) => {
          if (!statuses[0].isDone) {
            statuses[0].isDone = true;
          }
          statuses[1].progress = progress.percent;
          responsesToUpdate.forEach(listener => listener(statuses));
        }
        )
        .on('error', console.log)
        .on('close', () => {
          statuses[1].isDone = true;
          resolve();
        });
    });

    responsesToUpdate.forEach(listener => listener(statuses));

    /**
     * Convert with ffmpeg
     */
    await new Promise<void>(resolve => {
      ffmpeg(path.join(electronApp.getPath('temp'), `temp_${data.name}`))
        .audioBitrate(128)
        .setStartTime(data.start)
        .setDuration(data.duration)
        .on('progress', (progress) => {
          statuses[2].progress = progress.percent;
          responsesToUpdate.forEach(listener => listener(statuses));
        })
        .on('end', resolve)
        .save(outputPath);
    })

    statuses[2].isDone = true;
    statuses[3].progress = -1;
    responsesToUpdate.forEach(listener => listener(statuses));

    /**
     * Cleanup
     */

    fs.unlinkSync(path.join(electronApp.getPath('temp'), `temp_${data.name}`));
    statuses[3].isDone = true;
    responsesToUpdate.forEach(listener => listener(statuses));

    await importToSoundpad(outputPath);

    return res.end()
  })

  app.get('/api/import/youtube/progress', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    const listener = (statuses: { stepName: string, progress: number, isDone: boolean }[]) => {
      if (statuses.every(s => s.isDone)) {
        res.write(`data: ${JSON.stringify(statuses)}\n\n`);
        responsesToUpdate.splice(responsesToUpdate.indexOf(listener), 1);
        res.end();
      } else {
        res.write(`data: ${JSON.stringify(statuses)}\n\n`);
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
