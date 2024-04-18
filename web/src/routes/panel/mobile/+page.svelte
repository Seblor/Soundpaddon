<script lang="ts">
    import { isConnected } from "../../../client/connections";
    import Toolbar from "../../../components/mobile/toolbar.svelte";
    import { selectedLayout } from "../../../stores/settings";
    import AskServerIp from "./layouts/ask-server-ip.svelte";
    import Customized from "./layouts/customized.svelte";
    import Mirror from "./layouts/mirror.svelte";

</script>


<div class="no-scrollbar flex flex-col justify-between w-[100vw] h-full">
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