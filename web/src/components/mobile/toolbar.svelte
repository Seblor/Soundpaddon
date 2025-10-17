<script lang="ts">
  import { ProgressBar } from "@skeletonlabs/skeleton";
  import {
    isConnected,
    socket,
    soundpadClient,
  } from "../../client/connections";
  import CameraOffIcon from "virtual:icons/mdi/camera-off";
  import ToolbarButtons from "./toolbar-buttons.svelte";
  import QrcodeScanButton from "../buttons/qrcode-scan.svelte";
  import ManualHostButton from "../buttons/manual-host.svelte";
  import { checkIsDemo } from "$lib/utils/misc";
  import { playbackPosition, seek as seekDemo } from "$lib/demo/demo-audio";
  import { debounce, throttle } from "lodash";

  let position = 0;
  $: isSoundPlaying = Boolean(position);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (checkIsDemo()) {
    playbackPosition.subscribe((newPosition: number) => {
      position = newPosition;
    });
  }

  socket.on("playback-position", (playbackPosition) => {
    position = parseFloat(playbackPosition);
  });

  let progressBarElement: HTMLElement;
  let isDragging = false;

  function getPositionFromEvent(
    event: MouseEvent | TouchEvent,
    element: HTMLElement,
  ): number {
    const rect = element.getBoundingClientRect();
    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;
    const newPosition = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(1, newPosition));
  }

  function handlePointerDown(event: MouseEvent | TouchEvent) {
    if (!isSoundPlaying) return;
    isDragging = true;
    const newPosition = getPositionFromEvent(event, progressBarElement);
    seek(newPosition);

    // Prevent default to avoid text selection and other unwanted behaviors
    event.preventDefault();
  }

  function handlePointerMove(event: MouseEvent | TouchEvent) {
    if (!isSoundPlaying) return;
    if (!isDragging) return;

    const newPosition = getPositionFromEvent(event, progressBarElement);
    seek(newPosition);

    event.preventDefault();
  }

  function handlePointerUp() {
    isDragging = false;
  }

  function handleClick(event: MouseEvent) {
    if (!isSoundPlaying) return;
    if (!isDragging) {
      const newPosition = getPositionFromEvent(event, progressBarElement);
      seek(newPosition);
    }
  }

  const seek = throttle(async (newPosition: number) => {
    if (checkIsDemo()) {
      seekDemo(newPosition);
      return;
    }
    const seekPosition = newPosition;
    soundpadClient.sendQuery(
      `DoSeekMs(${seekPosition})`,
    );
  }, 100);
</script>

{#if $isConnected}
  <div class="flex flex-col h-full p-2 gap-2">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      bind:this={progressBarElement}
      class="cursor-pointer select-none"
      tabindex="0"
      role="slider"
      aria-label="Seek position"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={isNaN(position) ? 0 : Math.round(position * 100)}
      on:mousedown={handlePointerDown}
      on:mousemove={handlePointerMove}
      on:mouseup={handlePointerUp}
      on:mouseleave={handlePointerUp}
      on:touchstart={handlePointerDown}
      on:touchmove={handlePointerMove}
      on:touchend={handlePointerUp}
      on:click={handleClick}
      on:keydown={() => {}}
    >
      <ProgressBar value={isNaN(position) ? 0 : position * 100}></ProgressBar>
    </div>
    <div class="w-full flex justify-between">
      <ToolbarButtons {isSoundPlaying} />
    </div>
  </div>
{:else}
  <div class="flex border-t size-full items-center justify-center gap-2">
    {#if isSafari}
      <!-- Safari does not support barcode or QRCode scanner APIs -->
      <button
        type="button"
        disabled
        class={`btn variant-filled btn-icon active:scale-75 select-none`}
      >
        <span>
          <CameraOffIcon color="red" />
        </span>
      </button>
    {:else}
      <QrcodeScanButton />
    {/if}
    <ManualHostButton />
  </div>
{/if}
