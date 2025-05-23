<script lang="ts">
  import type { FetchedSound } from "$lib/api-return-types";
  import WarningIcon from "virtual:icons/mdi/warning";
  import LoadingIcon from "virtual:icons/mdi/loading";
  import { ProgressBar, getModalStore, popup } from "@skeletonlabs/skeleton";
  import { getEndpointUrl } from "$lib/utils/api";
  import DisabledInDemoPopup from "../demo/DisabledInDemoPopup.svelte";
  import { checkIsDemo, demoPopupConfig } from "$lib/utils/misc";
  import { onMount } from "svelte";
  import { shownDrivers, driverStyleConfig } from "$lib/demo/configs";
  import { driver } from "driver.js";

  const modalStore = getModalStore();

  const soundData = $modalStore[0].meta as {
    sound: FetchedSound;
    isEarRape: boolean;
    downloadFile: (fileName: string) => Promise<void>;
  };

  let isDownloading = false;
  let currentProgress = 0;
  let error = "";

  $: hasEarrapeInName = /ear ?r?ape/.test(soundData.sound.name.toLowerCase());

  async function modalButtonPressed() {
    if (error) {
      modalStore.close();
      return;
    }
    const es = new EventSource(`${getEndpointUrl()}/import/url/progress`);
    es.onmessage = function (event) {
      currentProgress = parseFloat(event.data);
    };

    es.onerror = function (event) {
      es.close();
    };

    isDownloading = true;
    await soundData
      .downloadFile(newSoundName)
      .then(() => {
        error = "";
        modalStore.close();
      })
      .catch((e) => {
        error =
          "An error occurred while importing the sound. This is most likely an issue with the soundbank's website.";
      });
    isDownloading = false;
  }

  $: newSoundName = (
    soundData.sound.name ??
    soundData.sound.url.split("/").at(-1) ??
    ""
  ).replace(/[^a-zA-Z0-9 .]/g, "_");

  onMount(async () => {
    if (hasEarrapeInName && !shownDrivers.has("sound-download-earrape-title")) {
      await new Promise((r) => setTimeout(r, 100));
      shownDrivers.add("sound-download-earrape-title");
      const earrapeWarningGuide = driver({
        ...driverStyleConfig,
        showButtons: [],
      });
      earrapeWarningGuide.highlight({
        element: ".guide-sound-earrape-title-warning",
        popover: {
          title: "Excessive volume",
          description: `This sound has "earrape" in its name, which means it might be very loud.`,
        },
      });
    }
  });
</script>

{#if $modalStore[0]?.meta?.sound != undefined}
  <div class="w-2/3 card p-4 flex flex-col gap-4">
    <div class="card-header text-2xl">
      Download <pre class="inline">{soundData.sound.name}</pre>
      ?
    </div>
    <div>
      <label class="relative label w-full">
        <span>Confirm the file name</span>
        <input
          class="input h-8 px-2 text-center"
          type="text"
          placeholder="Sound name"
          bind:value={newSoundName}
        />
      </label>
    </div>
    {#if soundData.isEarRape || hasEarrapeInName}
      <aside
        class={`alert variant-filled-error ${hasEarrapeInName ? "guide-sound-earrape-title-warning" : ""}`}
      >
        <!-- Icon -->
        <div><WarningIcon font-size="64" /></div>
        <!-- Message -->
        <div class="alert-message">
          <h3 class="h3">VOLUME WARNING</h3>
          <p>
            This sound {#if !soundData.isEarRape}
              most likely
            {/if} has a very high volume. Soundpaddon reduced it for you during the
            preview, but it will not be changed when adding it to Soundpad
          </p>
        </div>
      </aside>
    {/if}
    {#if error}
      <div class="text-error-500">{error}</div>
    {/if}
    <div class="card-footer flex flex-col justify-stretch items-end gap-4">
      <DisabledInDemoPopup />
      <button
        class="btn bg-primary-700"
        use:popup={demoPopupConfig}
        disabled={checkIsDemo() || isDownloading}
        on:click={modalButtonPressed}
      >
        {#if isDownloading}
          <LoadingIcon class="animate-spin" />
        {:else if error}
          Close
        {:else}
          Import to Soundpad
        {/if}
      </button>
      {#if isDownloading}
        <ProgressBar class="w-full" value={currentProgress} />
      {/if}
    </div>
  </div>
{/if}
