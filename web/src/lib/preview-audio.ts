import { getEndpointUrl } from "./utils/api";
import { checkIsDemo } from "./utils/misc";

let audioElement = undefined as unknown as HTMLAudioElement;
const outputAudio = new Audio();

export function initAudioPreviewer() {
  audioElement = document.createElement("audio")
  audioElement.crossOrigin = "anonymous";
  audioElement.preload = "none";

  const audioContext = new AudioContext();

  const source = audioContext.createMediaElementSource(audioElement);
  const delayNode = audioContext.createDelay();
  delayNode.delayTime.setValueAtTime(0.1, audioContext.currentTime);
  const destination = audioContext.createMediaStreamDestination();
  outputAudio.srcObject = destination.stream;
  outputAudio.play();

  const safetyAnalyser = audioContext.createAnalyser();

  source.connect(delayNode);
  delayNode.connect(destination);
  source.connect(safetyAnalyser);

  audioElement.addEventListener("playing", () => {
    outputAudio.volume = 0.5;
    protectEars(safetyAnalyser);
  });

  audioElement.addEventListener("loadeddata", () => {
    listeners.onLoaded();
  });

  audioElement.addEventListener("pause", () => {
    listeners.onPause();
  });

  audioElement.addEventListener("ended", () => {
    listeners.onEnd();
  });
}

type Listeners = {
  onLoaded: () => void;
  onPlay: () => void;
  onPause: () => void;
  onEnd: () => void;
  onEarRape: () => void;
}

const listeners = {
  onLoaded: () => { },
  onPlay: () => { },
  onPause: () => { },
  onEnd: () => { },
  onEarRape: () => { },
} as Listeners;

export async function previewAudio(url: string, newListeners: Partial<Listeners>) {
  listeners.onEnd();
  audioElement.pause();
  await new Promise(resolve => setTimeout(resolve, 100)); // Wait for the audio to stop playing

  audioElement.src = checkIsDemo() ? url : `${getEndpointUrl()}/proxy/${url}`

  listeners.onLoaded = newListeners.onLoaded ?? (() => {});
  listeners.onPlay = newListeners.onPlay ?? (() => {});
  listeners.onPause = newListeners.onPause ?? (() => {});
  listeners.onEnd = newListeners.onEnd ?? (() => {});
  listeners.onEarRape = newListeners.onEarRape ?? (() => {});

  audioElement.play();
}

export function stopPreview() {
  audioElement.pause();
  listeners.onPause();
  audioElement.currentTime = 0;
  audioElement.src = "";
}

function protectEars(analyser: AnalyserNode) {
  analyser.fftSize = 2048;
  analyser.minDecibels = -90;

  const bufferLength = analyser.frequencyBinCount;
  const fbc_array = new Uint8Array(bufferLength);

  analyser.getByteTimeDomainData(fbc_array);
  const dataArray = new Uint8Array(fbc_array.buffer);

  if (dataArray.filter((val) => val >= 240).length > 2) {
    outputAudio.volume = 0.1;
    listeners.onEarRape();
  }

  if (audioElement.paused === false) {
    setTimeout(protectEars.bind(null, analyser), 100);
  }
}