import fetch from 'node-fetch-commonjs';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
// @ts-ignore
import Progress from 'node-fetch-progress';
import Soundpad from 'soundpad.js';

const soundpad = new Soundpad({
  startSoundpadOnConnect: true,
});
soundpad.connect();

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function isBuild(): boolean {
  return process.env.npm_lifecycle_event === 'build'
}

export function timeMarkToSeconds(timeMark: string): number {
  const [hours, minutes, seconds] = timeMark.split('.')[0].split(':').map(Number);
  return hours * 60 * 60 + minutes * 60 + seconds;
}

export async function importToSoundpad(fileToImport: string) {
  await soundpad.connectionAwaiter
  return soundpad.addSound(fileToImport);
}

export function downloadFile(url: string, targetPath: string, update: (progress: DownloadProgress) => void = () => { }): Promise<void> {
  if (!fs.existsSync(path.join(targetPath, '..'))) {
    fs.mkdirSync(path.join(targetPath, '..'), { recursive: true })
  }
  return new Promise((resolve, reject) => {
    fetch(url).then(res => {
      const progress = new Progress(res, { throttle: 100 })
      progress.on('progress', update)
      const dest = fs.createWriteStream(targetPath);
      if (res.body === null) {
        reject(new Error('Response body is null'))
        return
      }
      res.body.pipe(dest);
      dest.on('finish', () => {
        dest.close()
        resolve()
      });
    })
  })
}

type DownloadProgress = {
  total: number,
  done: number,
  totalh: string,
  doneh: string,
  startedAt: number,
  elapsed: number,
  rate: number,
  rateh: string,
  estimated: number,
  progress: number,
  eta: number,
  etah: string,
  etaDate: Date,
}