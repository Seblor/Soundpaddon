<script lang="ts">
  import { onMount } from "svelte";
  import { socket, soundpadClient } from "../../../client/connections";
  import { checkIsDemo } from "$lib/utils/misc";

  onMount(() => {
    if (checkIsDemo() === false) {
      socket.connect();
    }
    // @ts-ignore
    window.soundpad = soundpadClient;
  });
</script>

<div class="flex justify-between items-center h-[100vh] gap-4">
  <slot />

  <div class="mr-4">
    <iframe
      id="guide-mobile-preview"
      seamless
      src="/panel/mobile"
      frameborder="0"
      title="mobile view"
      class="max-h-[75vh] w-96 h-[48rem] border-8 border-black rounded-lg shadow-lg resize"
      style="direction: rtl"
    ></iframe>
  </div>
</div>
