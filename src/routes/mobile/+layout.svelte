<script lang="ts">
  import Toolbar from "../../components/toolbar.svelte";
  import { onMount } from "svelte";
  import { sounds } from "../../stores/sounds";
  import Mirror from "./layouts/mirror.svelte";
  import { isConnected, socket, soundpadClient } from "../../client/connections";
  import { selectedLayout, serverHost } from "../../stores/settings";
  import Customized from "./layouts/customized.svelte";
  import AskServerIp from "./layouts/ask-server-ip.svelte";

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

<div class="flex flex-col justify-between w-[100vw] h-full">
  <div class="flex grow shrink overflow-hidden mb-20">
    {#if $isConnected}
      {#if $selectedLayout === "mirror"}
        <Mirror />
      {:else}
        <Customized />
      {/if}
    {:else}
      <AskServerIp />
    {/if}
    <slot />
  </div>
  <div class="w-full fixed bottom-0 highlighted-bar h-20">
    <Toolbar />
  </div>
</div>
