<script lang="ts">
  import { onMount } from "svelte";
  import { socket } from "../../../client/connections";
  import { checkIsDemo } from "$lib/utils/misc";

  onMount(() => {
    if (checkIsDemo() === false) {
      socket.connect();
    }
  });
</script>

<div class="no-scrollbar flex justify-between items-center h-[100vh] gap-4">
  <slot />
</div>
