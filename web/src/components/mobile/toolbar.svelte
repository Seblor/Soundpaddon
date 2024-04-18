<script lang="ts">
  import { ProgressBar } from "@skeletonlabs/skeleton";
  import { isConnected, socket } from "../../client/connections";
  import ToolbarButtons from "./toolbar-buttons.svelte";
  import QrcodeScanButton from "../buttons/qrcode-scan.svelte";
  import ManualHostButton from "../buttons/manual-host.svelte";
  import { checkIsDemo } from "$lib/utils/misc";
  import { playbackPosition } from "$lib/demo/demo-audio";

  let data = 0;

  if (checkIsDemo()) {
    playbackPosition.subscribe((position: number) => {
      data = position;
    });
  }

  socket.on("playback-position", (playbackPosition) => {
    data = parseFloat(playbackPosition);
  });
</script>

{#if $isConnected}
  <div class="flex flex-col h-full p-2 gap-2">
    <ProgressBar value={isNaN(data) ? 0 : data * 100}></ProgressBar>
    <div class="w-full flex justify-between">
      <ToolbarButtons isSoundPlaying={Boolean(data)} />
    </div>
  </div>
{:else}
  <div class="flex border-t size-full items-center justify-center gap-2">
    <QrcodeScanButton />
    <ManualHostButton />
  </div>
{/if}
