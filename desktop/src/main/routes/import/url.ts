import bodyParser from 'body-parser';
import { type Application, type Request, type Response, } from 'express';
import { App } from 'electron/main';
import path from 'node:path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { importToSoundpad, timeMarkToSeconds } from '../../utils/misc';
import jsdom from 'jsdom';
import fetch from 'node-fetch-commonjs';
import Fuse from 'fuse.js'
import type { FetchedSound, SOUND_SOURCES } from '../../../customTypes';
import fs from 'node:fs';
import { getDownloadLocation } from '../../download-location-tray-option';

ffmpeg.setFfmpegPath(ffmpegInstaller.path.replace('app.asar', 'app.asar.unpacked'))

const responsesToUpdate: Array<(newProgress: number, isDone: boolean) => void> = [];

export default function registerRoutes (app: Application, electronApp: App) {
  app.post('/api/import/url', bodyParser.json(), async function (req: Request, res: Response) {
    const data = req.body as {
      name: string,
      url: string,
    };

    const outputPath = path.join(getDownloadLocation(electronApp), (data.name ? path.normalize(data.name) : path.basename(data.url)).replace(/\.[^/.]+$/, '') + '.mp3');

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    await new Promise(resolve => {
      ffmpeg(data.url)
        .addOutputOption('-map_metadata', '-1')
        .audioBitrate(128)
        .on('progress', (progress) => {
          responsesToUpdate.forEach(listener => listener(progress.percent, false));
        })
        .on('end', resolve)
        .on('error', (err) => {
          res.status(500).send('Error while converting audio');
          resolve('Error while converting audio');
        })
        .save(outputPath);
    })

    await importToSoundpad(outputPath);

    return res.end()
  })

  app.get('/api/import/url/search/:searchQuery', bodyParser.json(), async function (req: Request, res: Response) {
    const searchQuery = req.params.searchQuery;

    const allSounds = await Promise.all(
      Object.values(importers)
        .map(importer => importer(searchQuery).catch(() => [] as Array<FetchedSound>))
    )

    const fuse = new Fuse(allSounds.flat(), {
      keys: ['name'],
      includeScore: true,
      isCaseSensitive: false,
      shouldSort: true,
    });

    return res.send(fuse.search(searchQuery)
      .sort((a, b) => a.score - b.score)
      .map(result => result.item))
  })

  app.get('/api/import/url/extract/:webPageUrl', bodyParser.json(), async function (req: Request, res: Response) {
    const webPageUrl = decodeURIComponent(req.params.webPageUrl ?? '');
    if (webPageUrl === '') {
      return res.status(400).send('Invalid URL');
    }

    const fetchHeaders = await fetch(webPageUrl).then(res => res.headers).catch(() => {
      res.send([])
      return null
    })

    if (fetchHeaders.get('content-type').startsWith('audio')) {
      return res.send([{
        name: webPageUrl.split('/').pop() ?? 'audio',
        url: webPageUrl,
        source: 'webpage',
      }])
    }

    const webPage = await jsdom.JSDOM.fromURL(webPageUrl).catch(() => {
      res.send([])
      return null
    })

    const allowedExtensions = [
      'mp3',
      'wav',
      'ogg',
      'm4a',
      'flac',
    ]

    const audioFilesFound = [...webPage.window.document.body.innerHTML.matchAll(new RegExp(`/?([a-zA-Z0-9/-_.]+/([a-zA-Z0-9-_.]+\\.(${allowedExtensions.join('|')})))`, 'g'))]
      .map(match => {
        const name = match[2]
        const fullUrl = new URL(match[0], webPageUrl).href
        let url = ''
        if (fullUrl.startsWith('http')) {
          url = fullUrl
        } else if (fullUrl.startsWith('/')) {
          url = new URL(fullUrl, webPageUrl).href
        } else {
          url = webPageUrl.replace(/\/[^/]*$/, `/${fullUrl}`)
        }
        return ({
          name,
          url,
          source: 'webpage',
        })
      }) as Array<FetchedSound>

    const uniqueSounds = audioFilesFound.filter((sound, index, self) =>
      index === self.findIndex(t => (
        t.url === sound.url
      ))
    )

    return res.send(uniqueSounds)
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

const importers: Partial<Record<SOUND_SOURCES, (searchFilter: string) => Promise<FetchedSound[]>>> = {
  myinstants: async function (searchFilter: string) {
    const output = await jsdom.JSDOM.fromURL(getURL('myinstants', searchFilter));
    const sounds = [...output.window.document.querySelectorAll('.instant')].map(el => {
      const name = el.querySelector('a').textContent
      const url = RegExp(/\/media.*\.mp3/).exec(el.outerHTML)
      if (!url) {
        return null
      }
      return { source: 'myinstants' as SOUND_SOURCES, name, url: `https://www.myinstants.com${url[0]}` }
    })
    return sounds.filter(Boolean)
  },
  voicy: async function (searchFilter: string) {
    const output = await fetch(getURL('voicy', searchFilter)).then(res => res.json()) as {
      error: boolean,
      errorMessage: string | null,
      data: Array<{
        name: string,
        source: string,
      }>
    }
    const sounds = output.data.map(data => {
      return { source: 'voicy' as SOUND_SOURCES, name: data.name, url: `https://files.voicy.network/public${data.source}` }
    })
    return sounds
  },
  freesound: async function (searchFilter: string) {
    const output = await jsdom.JSDOM.fromURL(getURL('freesound', searchFilter));
    const sounds = [...output.window.document.querySelectorAll('.bw-player[data-mp3]')].map(el => {
      return { source: 'freesound' as SOUND_SOURCES, name: el.getAttribute('data-title'), url: el.getAttribute('data-mp3') }
    })
    return sounds.filter(Boolean)
  },
  uwupad: async function (searchFilter: string) {
    const output = await fetch(getURL('uwupad', searchFilter)).then(res => res.json()).catch(console.error) as Array<{
      title: string,
      extension: string,
      id: number,
    }>
    const sounds = output.map(data => {
      return { source: 'uwupad' as SOUND_SOURCES, name: data.title, url: `https://cdn.uwupad.me/${data.id}.${data.extension}` }
    })
    return sounds
  },
  pixabay: async function (searchFilter: string) {
    const output = await jsdom.JSDOM.fromURL(getURL('pixabay', searchFilter));
    const sounds = [...output.window.document.querySelectorAll('div[class^="nameAndTitle"]>a')]
      .map((el: HTMLAnchorElement) => el.href.match(/sound-effects\/(.+)-(\d+)\//))
      .filter(el => el)
      .map((match) => {
        return { source: 'pixabay' as SOUND_SOURCES, name: match[1].replace(/-/g, ' '), url: `https://pixabay.com//fr/sound-effects/download/id-${match[2]}.mp3` }
      })
    return sounds
  },
}

function getURL (source: SOUND_SOURCES, searchFilter: string): string {
  switch (source) {
    case 'myinstants':
      return `https://www.myinstants.com/search/?name=${encodeURIComponent(searchFilter)}`;
    case 'freesound':
      return `https://freesound.org/search/?q=${encodeURIComponent(searchFilter)}`;
    case 'voicy':
      return `https://server.voicy.network/api/clips?Type=0&Search=${encodeURIComponent(searchFilter)}&Quantity=20&Index=0&NSFW=true`;
    case 'uwupad':
      return `https://uwupad.me/api/search?query=${encodeURIComponent(searchFilter)}&limit=20&offset=0`;
    case 'pixabay':
      return `https://pixabay.com/fr/sound-effects/search/${encodeURIComponent(searchFilter)}/`;
  }
}
