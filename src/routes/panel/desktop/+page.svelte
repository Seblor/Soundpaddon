<script lang="ts">
  import { AppRail, AppRailAnchor, AppRailTile } from "@skeletonlabs/skeleton";
  import QRCodeIcon from "virtual:icons/mdi/qrcode";
  import YoutubeIcon from "virtual:icons/mdi/youtube";
  import DiscordIcon from "virtual:icons/mdi/discord";
  import MyInstantsIcon from "virtual:icons/mdi/gesture-tap";
  import PairingQrcode from "../../../components/dekstop/pairing-qrcode.svelte";

  let currentTile = 0;
</script>

<div class="flex items-center justify-between w-full h-full">
  <AppRail class="min-w-[100px]">
    <svelte:fragment slot="lead">
      <AppRailAnchor
        ><img
          src="/icon.png"
          alt="Soundpaddon icon"
          class="scale-50"
        />
        <div class="-translate-y-2">Soundpaddon</div>
        </AppRailAnchor
      >
    </svelte:fragment>
    <!-- --- -->
    <AppRailTile
      bind:group={currentTile}
      name="tile-1"
      value={0}
      title="tile-1"
    >
      <svelte:fragment slot="lead"
        ><QRCodeIcon
          class="justify-center w-full"
          color="white"
          font-size="32"
        /></svelte:fragment
      >
      <div class="px-2 pb-2">
        <span class="text-white">Pair with your devides</span>
      </div>
    </AppRailTile>
    <AppRailTile
      bind:group={currentTile}
      name="tile-2"
      value={1}
      title="tile-2"
    >
      <svelte:fragment slot="lead"
        ><YoutubeIcon
          class="justify-center w-full"
          color="white"
          font-size="32"
        /></svelte:fragment
      >
      <div class="px-2 pb-2">
        <span class="text-white text-center">Import From Youtube</span>
      </div>
    </AppRailTile>
    <AppRailTile
      bind:group={currentTile}
      name="tile-3"
      value={2}
      title="tile-3"
    >
      <svelte:fragment slot="lead"
        ><MyInstantsIcon
          class="justify-center w-full"
          color="white"
          font-size="32"
        /></svelte:fragment
      >
      <div class="px-2 pb-2">
        <span class="text-white text-center">Import From Myinstants</span>
      </div>
    </AppRailTile>
    <!-- --- -->
    <svelte:fragment slot="trail">
      <AppRailAnchor
        href="https://support.soundpaddon.app"
        target="_blank"
        title="Support Discord server"
      >
        <div class="flex flex-col items-center">
          <DiscordIcon class="grow size-1/2" />
          <div class="">
            <span class="text-white text-center">Support</span>
          </div>
        </div>
      </AppRailAnchor>
    </svelte:fragment>
  </AppRail>

  <div class="flex grow justify-center ml-4">
    {#if currentTile === 0}
      <div class="flex flex-col items-center text-center gap-4">
        <h1 class="text-2xl">Scan this QRCode with your phone</h1>
        <PairingQrcode />
        <p>
          you can scan it from the <kbd class="bg-slate-700 rounded">soundpaddon.app</kbd> website on your phone or with
          your usual QRCode scan application
        </p>
      </div>
    {/if}
    {#if currentTile === 1}
      <div>Tile 2</div>
    {/if}
    {#if currentTile === 2}
      <div>
        Import
      </div>
    {/if}
  </div>
</div>
