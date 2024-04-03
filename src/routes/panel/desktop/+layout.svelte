<script lang="ts">
  import { onMount } from "svelte";
  import { socket, soundpadClient } from "../../../client/connections";

  onMount(() => {
    socket.connect();
    // @ts-ignore
    window.soundpad = soundpadClient;
  });
</script>

<div class="h-[100vh]">
  <slot />
</div>
