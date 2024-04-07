<script lang="ts">
  import { ProgressBar } from "@skeletonlabs/skeleton";
  import { isConnected, socket } from "../client/connections";
  import ToolbarButtons from "./toolbar-buttons.svelte";
  import QrcodeScanButton from "./buttons/qrcode-scan.svelte";
  import ManualHostButton from "./buttons/manual-host.svelte";

  socket.on("playback-position", (playbackPosition) => {
    data = parseFloat(playbackPosition);
  });

  let data = 0;
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
