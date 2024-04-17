<script lang="ts">
  import LoadingIcon from "virtual:icons/mdi/loading";
  import DownloadIcon from "virtual:icons/mdi/download";
  import PlayIcon from "virtual:icons/mdi/play";
  import StopIcon from "virtual:icons/mdi/stop";
  import { getEndpointUrl } from "$lib/utils/api";
  import type { FetchedSound } from "$lib/api-return-types";
  import { onDestroy, onMount } from "svelte";
  import { previewAudio, stopPreview } from "$lib/preview-audio";
  import { getModalStore } from "@skeletonlabs/skeleton";

  const modalStore = getModalStore();

  enum AUDIO_STATE {
    INITIAL,
    LOADING,
    PLAYING,
    STOPPED,
  }

  let audioState = AUDIO_STATE.INITIAL;
  let isEarRape = false;
  let isDownloading = false;

  export let sound: FetchedSound;

  function handlePlayClick() {
    if (audioState !== AUDIO_STATE.PLAYING) {
      if (audioState === AUDIO_STATE.INITIAL) {
        audioState = AUDIO_STATE.LOADING;
      }
      previewAudio(sound.url, {
        onPlay: () => {
          audioState = AUDIO_STATE.PLAYING;
        },
        onPause: () => {
          audioState = AUDIO_STATE.STOPPED;
        },
        onEnd: () => {
          audioState = AUDIO_STATE.STOPPED;
        },
        onLoaded: () => {
          audioState = AUDIO_STATE.PLAYING;
        },
        onEarRape: () => {
          isEarRape = true;
        },
      });
    } else if (audioState === AUDIO_STATE.PLAYING) {
      stopPreview();
    }
  }

  function openDownloadModal() {
    modalStore.trigger({
      type: "component",
      component: "downloadFileModal",
      meta: {
        sound,
        isEarRape,
        downloadFile: importToSoundpad,
      },
    });
  }

  async function importToSoundpad(fileName: string): Promise<void> {
    isDownloading = true;
    await fetch(`${getEndpointUrl()}/import/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: sound.url,
        name: fileName,
      }),
    });
    isDownloading = false;
  }

  onDestroy(() => {
    if (audioState === AUDIO_STATE.PLAYING) {
      stopPreview();
    }
  })
</script>

<div
  class={`card ${isEarRape ? "!bg-error-800" : ""} flex flex-col justify-center items-center aspect-square overflow-hidden break-all basis-1/6`}
>
  <div class="grow flex flex-wrap break-all p-2 overflow-scroll">
    {sound.name}
  </div>
  <div class="shrink flex justify-between p-1 pt-0 w-full">
    <button
      type="button"
      class="scale-75 btn-icon btn-icon-sm variant-filled-primary"
      disabled={audioState === AUDIO_STATE.LOADING}
      on:click={handlePlayClick}
    >
      {#if audioState === AUDIO_STATE.LOADING}
        <LoadingIcon class="animate-spin" />
      {:else if audioState === AUDIO_STATE.PLAYING}
        <StopIcon />
      {:else}
        <PlayIcon />
      {/if}
    </button>
    <button
      type="button"
      class="scale-75 btn-icon btn-icon-sm variant-filled-primary"
      disabled={isDownloading}
      on:click={openDownloadModal}
    >
      {#if isDownloading}
        <LoadingIcon class="animate-spin" />
      {:else}
        <DownloadIcon />
      {/if}
    </button>
  </div>
</div>
