import type { FetchedSound } from "$lib/api-return-types";
import type { Sound } from "soundpad.js/lib/web";

export const demoData: Sound[] = [
  {
    "index": 1,
    "url": "/demo-sounds/taking-the-hobbits-to-isengard-mp3cut.mp3",
    "artist": "",
    "title": "taking-the-hobbits-to-isengard-mp3cut",
    "duration": "0:08",
    "addedOn": "2024-04-17",
    "lastPlayedOn": "",
    "playCount": 0
  },
  {
    "index": 2,
    "url": "/demo-sounds/murloc.mp3",
    "artist": "",
    "title": "murloc",
    "duration": "0:03",
    "addedOn": "2024-04-17",
    "lastPlayedOn": "",
    "playCount": 0
  },
  {
    "index": 3,
    "url": "/demo-sounds/freebird.mp3",
    "artist": "",
    "title": "freebird",
    "duration": "0:17",
    "addedOn": "2024-04-17",
    "lastPlayedOn": "",
    "playCount": 0
  },
  {
    "index": 4,
    "url": "/demo-sounds/bonk.mp3",
    "artist": "",
    "title": "bonk",
    "duration": "0:02",
    "addedOn": "2024-04-17",
    "lastPlayedOn": "2024-04-17",
    "playCount": 2
  },
  {
    "index": 5,
    "url": "/demo-sounds/bell.mp3",
    "artist": "",
    "title": "bell",
    "duration": "0:03",
    "addedOn": "2024-04-17",
    "lastPlayedOn": "2024-04-17",
    "playCount": 1
  },
  {
    "index": 6,
    "url": "/demo-sounds/quack.mp3",
    "artist": "",
    "title": "quack",
    "duration": "0:01",
    "addedOn": "2024-04-17",
    "lastPlayedOn": "",
    "playCount": 0
  },
  {
    "index": 7,
    "url": "/demo-sounds/Spooky Scary Skeleton.mp3",
    "artist": "",
    "title": "Spooky Scary Skeleton",
    "duration": "0:06",
    "addedOn": "2024-04-17",
    "lastPlayedOn": "2024-04-17",
    "playCount": 1
  },
  {
    "index": 8,
    "url": "/demo-sounds/nope.mp3",
    "artist": "",
    "title": "nope",
    "duration": "0:00",
    "addedOn": "2024-04-17",
    "lastPlayedOn": "2024-04-17",
    "playCount": 1
  },
  {
    "index": 9,
    "url": "/demo-sounds/Cantina.mp3",
    "artist": "",
    "title": "Cantina",
    "duration": "0:28",
    "addedOn": "2024-04-17",
    "lastPlayedOn": "",
    "playCount": 0
  },
]

export const demoExtractor: FetchedSound[] = [
  {
    "name": "original.mp3",
    "url": "/demo-sounds/nyan-cat-original.mp3",
    "source": "webpage"
  },
  {
    "name": "original.ogg",
    "url": "/demo-sounds/nyan-cat-original.ogg",
    "source": "webpage"
  },
]

export const demoSoundbanks: FetchedSound[] = [
  {
    "name": "realtime-volume-detection.mp3",
    "url": "/demo-sounds/realtime-volume-detection.mp3",
    "source": "myinstants"
  },
  {
    "name": "crickets.mp3",
    "url": "/demo-sounds/crickets.mp3",
    "source": "voicy"
  },
  {
    "name": "fake earrape.mp3",
    "url": "/demo-sounds/fake earrape.mp3",
    "source": "myinstants"
  },
]
