<script lang="ts">
  import { onMount } from "svelte";
  import { sounds } from "../../stores/sounds";
  import { socket, soundpadClient } from "../../client/connections";

  socket.on("sounds", (soundsList) => {
    console.log(soundsList);
    sounds.set(soundsList);
  });

  onMount(() => {
    socket.connect();
    // @ts-ignore
    window.soundpad = soundpadClient;
  });
</script>

<slot />
