<script lang="ts">
  import { AppRail, AppRailAnchor, AppRailTile } from "@skeletonlabs/skeleton";
  import QRCodeIcon from "virtual:icons/mdi/qrcode";
  import YoutubeIcon from "virtual:icons/mdi/youtube";
  import DiscordIcon from "virtual:icons/mdi/discord";
  import ImportIcon from "virtual:icons/mdi/import";
  import MagnifyIcon from "virtual:icons/mdi/magnify";
  import PairingQrcode from "../../../components/dekstop/pairing-qrcode.svelte";
  import YoutubeExtractor from "../../../components/dekstop/youtube-extractor.svelte";
  import SoundBankLookup from "../../../components/dekstop/sound-bank-lookup.svelte";
  import SoundExtractor from "../../../components/dekstop/sound-extractor.svelte";
  import KoFi from "../../../components/icons/ko-fi.svelte";

  let currentTile = 0;
</script>

<div class="flex items-center justify-between w-full h-full">
  <AppRail class="min-w-[100px]">
    <svelte:fragment slot="lead">
      <a
        href={location.origin.includes("soundpaddon.app")
          ? "/"
          : "javascript:void()"}
      >
        <AppRailAnchor
          ><img
            src="/logo.svg"
            alt="Soundpaddon icon"
            class="scale-50 h-[100px]"
          />
          <div class="-translate-y-2">Soundpaddon</div>
        </AppRailAnchor>
      </a>
    </svelte:fragment>
    <!-- --- -->
    <AppRailTile
      class="guide-pair-section"
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
      class="guide-youtube-import-section"
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
      class="guide-soundbanks-import-section"
      bind:group={currentTile}
      name="tile-3"
      value={2}
      title="tile-3"
    >
      <svelte:fragment slot="lead"
        ><ImportIcon
          class="justify-center w-full"
          color="white"
          font-size="32"
        /></svelte:fragment
      >
      <div class="px-2 pb-2">
        <span class="text-white text-center">Import From Soundbanks</span>
      </div>
    </AppRailTile>
    <AppRailTile
      class="guide-extract-import-section"
      bind:group={currentTile}
      name="tile-4"
      value={3}
      title="tile-4"
    >
      <svelte:fragment slot="lead"
        ><MagnifyIcon
          class="justify-center w-full"
          color="white"
          font-size="32"
        /></svelte:fragment
      >
      <div class="px-2 pb-2">
        <span class="text-white text-center">Import From Web Page</span>
      </div>
    </AppRailTile>
    <!-- --- -->
    <svelte:fragment slot="trail">
      <AppRailAnchor
        href="https://ko-fi.com/seblor"
        target="_blank"
        title="Donation link"
      >
        <div class="flex flex-col items-center">
          <KoFi class="grow size-1/2" />
          <div class="mx-4">
            <span class="text-white text-center">Buy me a coffee ❤️</span>
          </div>
        </div>
      </AppRailAnchor>
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

  <div class="flex h-full grow justify-center items-center ml-4">
    {#if currentTile === 0}
      <div class="flex flex-col items-center text-center gap-4">
        <h1 class="text-2xl">Scan this QRCode with your phone</h1>
        <PairingQrcode />
        <p>
          You can scan it from the <kbd class="bg-slate-700 rounded"
            >soundpaddon.app</kbd
          > website on your phone or with your usual QRCode scan application
        </p>
      </div>
    {/if}
    {#if currentTile === 1}
      <YoutubeExtractor />
    {/if}
    {#if currentTile === 2}
      <SoundBankLookup />
    {/if}
    {#if currentTile === 3}
      <SoundExtractor />
    {/if}
  </div>
</div>
