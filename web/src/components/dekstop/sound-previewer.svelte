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
  import { shownDrivers, driverConfig, driverStyleConfig } from "$lib/demo/configs";
  import { driver } from "driver.js";
  import { checkIsDemo } from "$lib/utils/misc";

  const guide = driver({
    ...driverConfig,
    steps: [
      {
        element: ".guide-sound-previewer",
        popover: {
          title: "Sound found",
          description:
            "This is one of the sounds found by the importer you used.",
        },
      },
      {
        element: ".guide-sound-previewer-play",
        popover: {
          title: "Preview sound",
          description:
            "<p>Click this button to preview the sound. Click again to stop the preview.</p><p>Some sounds might be loud, but Soundpaddon will reduce the volume automatically !</p>",
        },
      },
      {
        element: ".guide-sound-previewer-download",
        popover: {
          title: "Import to Soundpad",
          description:
            "Click this button to import the sound to Soundpad. You can rename the sound before importing it.",
        },
      },
    ],
  });

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
        onEarRape: async () => {
          const wasEarrapeTriggered = isEarRape;
          isEarRape = true;
          await new Promise((r) => setTimeout(r, 100));
          if (wasEarrapeTriggered === false && !shownDrivers.has("sound-previewer-earrape")) {
            shownDrivers.add("sound-previewer-earrape");
            const earrapeGuide = driver({
              ...driverStyleConfig,
              showButtons: [],
            });
            earrapeGuide.highlight({
              element: ".guide-sound-previewer.earrape",
              popover: {
                title: "Excessive volume",
                description:
                  "Soundpaddon will automatically detect and reduce the volume of loud sounds in real time !",
              },
            });
          }
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

  onMount(() => {
    if (!shownDrivers.has("sound-previewer")) {
      shownDrivers.add("sound-previewer");
      guide.drive();
    }
  });

  onDestroy(() => {
    if (audioState === AUDIO_STATE.PLAYING) {
      stopPreview();
    }
  });
</script>

<div
  class={`guide-sound-previewer card ${isEarRape ? "!bg-error-800 earrape" : ""} flex flex-col justify-center items-center aspect-square overflow-hidden break-all basis-1/6`}
>
  <div class="grow flex flex-wrap break-all p-2 no-scrollbar overflow-scroll">
    {sound.name}
  </div>
  <div
    class="shrink flex justify-between p-1 pt-0 w-full"
    style="overflow: visible !important"
  >
    <button
      type="button"
      class="guide-sound-previewer-play scale-75 btn-icon btn-icon-sm variant-filled-primary"
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
      class="guide-sound-previewer-download scale-75 btn-icon btn-icon-sm variant-filled-primary"
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
