import { writable } from "svelte/store";

let audioElement = document.createElement("audio");
audioElement.crossOrigin = "anonymous";
audioElement.preload = "none";

audioElement.addEventListener("play", () => {
  isAudioPlaying.set(true);
})

audioElement.addEventListener("pause", () => {
  isAudioPlaying.set(false);
  playbackPosition.set(0);
})

audioElement.addEventListener("timeupdate", () => {
  playbackPosition.set(audioElement.currentTime / audioElement.duration);
})

export function playAudio(url: string) {
  audioElement.src = url;
  audioElement.play();
}

export function stopAudio() {
  audioElement.pause();
  audioElement.currentTime = 0;
}

export function togglePause() {
  if (audioElement.paused) {
    audioElement.play();
  } else {
    audioElement.pause();
  }
}

export function seek(position: number) {
  if (audioElement.duration) {
    audioElement.currentTime = position * audioElement.duration;
  }
}

export function setVolume(newVolume: number) {
  audioElement.volume = newVolume;
}

export const isAudioPlaying = writable(false);
export const playbackPosition = writable(0);
