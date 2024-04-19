<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import YTPlayer from "youtube-player";
  import { ProgressBar, popup } from "@skeletonlabs/skeleton";
  import ImportIcon from "virtual:icons/mdi/import";
  import LoadingIcon from "virtual:icons/mdi/loading";
  import YoutubeIcon from "virtual:icons/mdi/youtube";
  import DoubleRangeSlider from "../double-range-slider.svelte";
  import type { YouTubePlayer } from "youtube-player/dist/types";
  import { getEndpointUrl } from "$lib/utils/api";
  import DisabledInDemoPopup from "../demo/DisabledInDemoPopup.svelte";
  import { checkIsDemo, demoPopupConfig } from "$lib/utils/misc";
  import { driver } from "driver.js";
  import { driverConfig, shownDrivers } from "$lib/demo/configs";

  let videoPlayerElement: HTMLDivElement;
  let progress: number = -1;
  let player: YouTubePlayer | undefined;
  let videoUrl: string;
  let videoDuration: number = 0;
  let start = 0;
  let end = 1;
  let soundName: string = "";
  let isDownloading = false;

  const guide = driver({
    ...driverConfig,
    steps: [
      {
        element: "#guide-youtube-slider",
        popover: {
          side: "top",
          align: "center",
          title: "Extract only a part of the video",
          description:
            "Use the sliders to select the part of the video you want to import.",
        },
      },
    ],
  });

  let currentProgress = 0;

  $: updateVideoPlayer(youtube_parser(videoUrl ?? "") as string);

  $: seekTo(start);

  async function updateVideoPlayer(videoId: string | false) {
    if (videoId == false) {
      player?.destroy();
      player = undefined;
    } else {
      start = 0;
      end = 1;
      player = YTPlayer(videoPlayerElement, {
        videoId: youtube_parser(videoUrl) as string,
        width: 640,
        height: 360,
        playerVars: {
          autoplay: 0,
          controls: 1,
        },
      });

      videoDuration = await player.getDuration();
      soundName = (await player.getIframe()).title.replace(
        /[\\\\/:*?\"<>|]/g,
        "",
      );
    }
  }

  async function seekTo(position: number) {
    if (!player) {
      return;
    }
    player.seekTo(position * (await player.getDuration()), true);
  }

  onMount(() => {
    if (!shownDrivers.has("youtube-extractor")) {
      shownDrivers.add("youtube-extractor");
      guide.drive();
    }
    videoPlayerElement.innerHTML = ``;

    updateVideoPlayer(youtube_parser(videoUrl ?? "") as string);

    setInterval(async () => {
      if (player == null) {
        return;
      }
      const time = await player.getCurrentTime();
      const duration = await player.getDuration();
      progress = time / duration;

      if (progress >= end) {
        seekTo(start);
      }
    }, 100);
  });

  onDestroy(() => {
    player?.destroy();
  });

  function youtube_parser(url: string): string | false {
    const regExp =
      /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length == 11 ? match[1] : false;
  }

  async function importToSoundpad() {
    if (!player) {
      return;
    }

    const es = new EventSource(`${getEndpointUrl()}/import/youtube/progress`);

    es.onmessage = function (event) {
      const seconds = parseInt(event.data);
      const goal = Math.round((end - start) * totalDuration * 1000) / 1000;
      currentProgress = (seconds / goal) * 100;
    };

    es.onerror = function (event) {
      es.close();
    };

    const totalDuration = await player.getDuration();
    isDownloading = true;
    await fetch(`${getEndpointUrl()}/import/youtube`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: videoUrl,
        name: soundName,
        start: Math.round(start * totalDuration * 1000) / 1000,
        duration: Math.round((end - start) * totalDuration * 1000) / 1000,
      }),
    });
    isDownloading = false;
  }

  function secondsToHHMMSS(fullSeconds: number): string {
    let hours = Math.floor(fullSeconds / 3600);
    let minutes = Math.floor((fullSeconds - hours * 3600) / 60);
    let seconds = Math.round(fullSeconds - hours * 3600 - minutes * 60);

    if (hours > 0) {
      return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
      );
    }
    return (
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
    );
  }
</script>

<div class="flex flex-col items-center gap-4">
  <label class="label w-full">
    <input
      class="input h-8 px-2 text-center"
      type="text"
      placeholder="YouTube link"
      bind:value={videoUrl}
    />
  </label>
  <div class="shrink grid grid-flow-col h-full auto-cols-auto gap-4">
    <div class="place-self-end justify-self-end">
      {secondsToHHMMSS(start * videoDuration)}
    </div>
    <div class="w-full justify-self-center max-w-[640px] relative">
      <div
        class="flex justify-center items-center absolute w-[640px] h-[360px] bg-black -z-10"
      >
        <YoutubeIcon font-size="64" color="#ff1308" />
      </div>
      <div class="w-[640px] h-[360px]" bind:this={videoPlayerElement}></div>
      <div id="guide-youtube-slider">
        <DoubleRangeSlider bind:start bind:end />
      </div>
    </div>
    <div class="place-self-end justify-self-start">
      {secondsToHHMMSS(end * videoDuration)}
    </div>
  </div>
  <label class="label w-full">
    <input
      class="input h-8 px-2 text-center"
      type="text"
      placeholder="Sound name"
      bind:value={soundName}
    />
  </label>
  <button
    on:click={importToSoundpad}
    class={`w-1/3 btn bg-primary-700`}
    use:popup={demoPopupConfig}
    disabled={checkIsDemo() || isDownloading || !player}
  >
    {#if isDownloading}
      <LoadingIcon class="mr-3 animate-spin" />
    {:else}
      <ImportIcon class="mr-3" />
    {/if}
    Import in Soundpad</button
  >
  <div class="h-4 w-full">
    {#if isDownloading}
      <ProgressBar value={currentProgress} />
    {/if}
  </div>
</div>

<DisabledInDemoPopup />
