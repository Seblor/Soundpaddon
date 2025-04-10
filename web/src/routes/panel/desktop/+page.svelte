<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    AppRail,
    AppRailAnchor,
    AppRailTile,
  } from "@skeletonlabs/skeleton";
  import QRCodeIcon from "virtual:icons/mdi/qrcode";
  import YoutubeIcon from "virtual:icons/mdi/youtube";
  import DiscordIcon from "virtual:icons/mdi/discord";
  import UpdateIcon from "virtual:icons/mdi/update";
  import ImportIcon from "virtual:icons/mdi/import";
  import MagnifyIcon from "virtual:icons/mdi/magnify";
  import HammerScrewdriverIcon from "virtual:icons/mdi/hammer-screwdriver";
  import PairingQrcode from "../../../components/dekstop/pairing-qrcode.svelte";
  import YoutubeExtractor from "../../../components/dekstop/youtube-extractor.svelte";
  import SoundBankLookup from "../../../components/dekstop/sound-bank-lookup.svelte";
  import SoundExtractor from "../../../components/dekstop/sound-extractor.svelte";
  import KoFi from "../../../components/icons/ko-fi.svelte";
  import { checkForUpdate } from "$lib/update-checker";

  let newUpdateAvailable = false;
  let newUpdateVersion = "";

  checkForUpdate().then((update) => {
    newUpdateAvailable = update.newUpdateAvailable;
    newUpdateVersion = update.latestUpdateVersion;
  });

  let currentTile = 0;
</script>

<div class="flex items-center justify-between w-full h-full">
  <AppRail class="min-w-[100px]">
    <svelte:fragment slot="lead">
      <a
        href={location.origin.includes("soundpaddon.app") &&
        !location.origin.includes("local")
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
      {#if newUpdateAvailable}
        <AppRailAnchor
          href="https://github.com/Seblor/Soundpaddon/releases/latest"
          target="_blank"
          title="Update link"
        >
          <div class="flex flex-col items-center my-2">
            <UpdateIcon class="grow size-1/2" />
            <div class="mx-4">
              <span class="text-white text-center"
                >New update available: {newUpdateVersion} !</span
              >
            </div>
          </div>
        </AppRailAnchor>
      {/if}
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
          You can scan it from <kbd class="bg-slate-700 rounded"
            >soundpaddon.app/panel</kbd
          > on your phone or with your usual QRCode scan application
        </p>
        <hr class="w-full bg-gray-200 dark:bg-gray-700" />
        <div class="relative w-3/4 h-16">
          <Accordion class="absolute">
            <AccordionItem>
              <svelte:fragment slot="lead"
                ><HammerScrewdriverIcon /></svelte:fragment
              >
              <svelte:fragment slot="summary"
                >Troubleshooting and known issues</svelte:fragment
              >
              <svelte:fragment slot="content">
                <div
                  class="text-left bg-slate-700 bg-opacity-50 shadow-2xl rounded-xl p-2 max-h-52 overflow-y-scroll"
                >
                  For the pairing to work, Soundpaddon needs the following
                  requirements:
                  <ul class="list-disc ml-6 mt-2">
                    <li class="list-item">
                      Both devices must be on the same network.
                    </li>
                    <li class="list-item">
                      Your modem must support&nbsp;<a
                        class="text-blue-500 underline"
                        href="https://en.wikipedia.org/wiki/DNS_rebinding"
                        target="_blank">DNS rebinding</a
                      > (which is needed for security purposes).
                    </li>
                    <li>
                      You should open the link form the QRCode on your default
                      browser. Embedded browsers will most likely not work.
                    </li>
                  </ul>
                </div>
              </svelte:fragment>
            </AccordionItem>
            <!-- ... -->
          </Accordion>
        </div>
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
