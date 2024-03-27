import { type Socket } from "socket.io";
import Soundpad, { PlayStatus, type Sound } from 'soundpad.js'
import { sleep } from "../utils/misc";
import _ from 'lodash'

// Using multiple clients since Soundpad uses a named pipe, race conditions may mix responses in a single message
const clients = {
  playbackFetcher: new Soundpad({
    autoReconnect: true,
    startSoundpadOnConnect: true,
  }),
  soundsFetcher: new Soundpad({
    autoReconnect: true,
    startSoundpadOnConnect: true,
  }),
}

await Promise.all(Object.values(clients).map(client => client.connect()))

clients.playbackFetcher.addEventListener('close', console.log)

/**
 * === Playback Fetcher ===
 */
let playbackPosition = 0
let playbackDuration = 0
let playbackStatus = PlayStatus.STOPPED
const socketsToNotify: Socket[] = []

setImmediate(async () => {
  while (true) {
    await clients.playbackFetcher.connectionAwaiter

    const newPlaybackPosition = await clients.playbackFetcher.getPlaybackPosition()
    const newPlaybackDuration = await clients.playbackFetcher.getPlaybackDuration()
    const newPlaybackStatus = await clients.playbackFetcher.getPlayStatus()


    if (playbackStatus === PlayStatus.PLAYING && newPlaybackStatus === PlayStatus.STOPPED) {
      console.log('playback reset, notifying clients');
      socketsToNotify.forEach(socket => socket.emit('playback-position', 0))
    }

    if (newPlaybackStatus === PlayStatus.PLAYING && (newPlaybackPosition !== playbackPosition || newPlaybackDuration !== playbackDuration)) {
      console.log('playback changed, notifying clients');
      playbackPosition = newPlaybackPosition
      playbackDuration = newPlaybackDuration
      socketsToNotify.forEach(socket => socket.emit('playback-position', playbackPosition / playbackDuration))
    }
    playbackStatus = newPlaybackStatus
    await sleep(25)
  }
})

/**
 * === Sounds Fetcher ===
 */

let sounds: Sound[] = []

setImmediate(async () => {
  while (true) {
    await clients.soundsFetcher.connectionAwaiter

    const newSounds = await clients.soundsFetcher.getSoundListJSON()
    if (newSounds && _.isEqual(soundListToComparable(newSounds), soundListToComparable(sounds)) === false) {
      sounds = newSounds
      console.log('sounds list changed, notifying clients');
      socketsToNotify.forEach(socket => socket.emit('sounds', sounds))
    }
    await sleep(1000)
  }
})

/**
 * === Export ===
 */

export default function onWebsocketConnection(socket: Socket): void {
  socket.emit('sounds', sounds)
  socketsToNotify.push(socket)
  socket.on('disconnect', () => {
    socketsToNotify.splice(socketsToNotify.indexOf(socket), 1)
    console.log('Client disconnected => ' + socketsToNotify.length + ' clients remaining')
  })
}

function soundListToComparable(sounds: Sound[]): {
  index: number;
  title: string;
  url: string;
}[] {
  return sounds.map(sound => ({
    index: sound.index,
    title: sound.title,
    url: sound.url,
  }))
}
