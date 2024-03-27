<script lang="ts">
  import {
    Drawer,
    Modal,
    getDrawerStore,
    initializeStores,
  } from "@skeletonlabs/skeleton";
  import "../app.postcss";
  // @ts-ignore
  import { pwaInfo } from "virtual:pwa-info";
  import { DRAWER_TYPES } from "../utils/enums";
  import MobileSettings from "../components/drawers/mobile-settings.svelte";
  import LeftArrowIcon from "virtual:icons/mdi/arrow-left";
  import { swipe } from "svelte-gestures";
  import { settingsOpacity } from "../stores/settings";

  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";

  $: {
    console.log(webManifestLink);
  }

  initializeStores();

  const drawerStore = getDrawerStore();

  const drawerTitles = {
    [DRAWER_TYPES.MOBILE_SETTINGS]: "Settings",
  };

  let drawerId: DRAWER_TYPES = ($drawerStore.id = DRAWER_TYPES.MOBILE_SETTINGS);
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

<Modal />

<Drawer bgDrawer="" width="w-[320px] md:w-[480px]">
  <div
    class={`flex flex-col size-full transition-all highlighted-bar bg-opacity-${$settingsOpacity * 100} opacity-${$settingsOpacity * 100}`}
  >
    <div>
      <div
        class="flex items-center text-center h-10 border-b border-surface-500"
      >
        <button
          on:click={() => drawerStore.close()}
          class="p-2 border-r border-surface-500"
        >
          <LeftArrowIcon class="size-full" />
        </button>
        <h1 class="grow text-xl">
          {drawerTitles[drawerId]}
        </h1>
      </div>
    </div>
    <div
      class="grow pr-2 pb-2 overflow-auto"
      use:swipe={{}}
      on:swipe={(e) => {
        if (e.detail.direction === "right") drawerStore.close();
      }}
    >
      {#if $drawerStore.id === DRAWER_TYPES.MOBILE_SETTINGS}
        <MobileSettings />
      {:else}
        <!-- (fallback contents) -->
      {/if}
    </div>
  </div>
</Drawer>

<slot />
