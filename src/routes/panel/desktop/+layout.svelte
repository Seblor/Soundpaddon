<script lang="ts">
  import { onMount } from "svelte";
  import { socket, soundpadClient } from "../../../client/connections";

  onMount(() => {
    socket.connect();
    // @ts-ignore
    window.soundpad = soundpadClient;
  });
</script>

<div class="flex justify-between items-center h-[100vh] gap-4">
  <slot />

  <div class="mr-4">
    <iframe
      seamless
      src="/panel/mobile"
      frameborder="0"
      title="mobile view"
      class="w-96 h-[48rem] border-8 border-black rounded-lg shadow-lg resize"
      style="direction: rtl"
    ></iframe>
  </div>
</div>
