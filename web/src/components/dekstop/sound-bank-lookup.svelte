<script lang="ts">
  import { getEndpointUrl } from "$lib/utils/api";
  import LoadingIcon from "virtual:icons/mdi/loading";
  import CheckmarkIcon from "virtual:icons/mdi/check";
  import _ from "lodash";
  import type { FetchedSound } from "$lib/api-return-types";
  import SoundFetched from "./sound-previewer.svelte";
  import { onMount } from "svelte";
  import { initAudioPreviewer } from "$lib/preview-audio";
  import type { SOUND_SOURCES } from "$lib/api-return-types";
  import { checkIsDemo, demoPopupConfig } from "$lib/utils/misc";
  import { popup } from "@skeletonlabs/skeleton";
    import DisabledInDemoPopup from "../demo/DisabledInDemoPopup.svelte";
    import { demoSoundbanks } from "$lib/demo/demo-sounds";

  let searchFilter = checkIsDemo() ? "Some examples" : "";
  let soundsFound: FetchedSound[] = checkIsDemo() ? demoSoundbanks :[];
  let isFetching = false;

  const sources: SOUND_SOURCES[] = ["myinstants", "freesound", "voicy"];

  let selectedSources: SOUND_SOURCES[] = [...sources];

  $: filteredSounds = soundsFound.filter((sound) =>
    selectedSources.includes(sound.source),
  );

  const searchSounds = _.debounce(async () => {
    if (searchFilter.trim() === "") {
      return;
    }
    isFetching = true;
    soundsFound = await fetch(
      `${getEndpointUrl()}/import/url/search/${searchFilter.replace(/\W/g, "_")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => res.json());
    isFetching = false;
  }, 500);

  onMount(() => {
    initAudioPreviewer();
  });
</script>

<div class="h-full w-full">
  <div class="flex flex-col py-8 h-full items-center gap-4">
    <label class="relative label w-full">
      <input
        use:popup={demoPopupConfig}
        class="input h-8 px-2 text-center"
        type="text"
        disabled={checkIsDemo() || isFetching}
        placeholder="Search a sound"
        bind:value={searchFilter}
        on:input={() => searchSounds()}
      />
      {#if isFetching}
        <LoadingIcon class="absolute right-2 top-2 animate-spin !-mt-0.5" />
      {/if}
    </label>
    <div class="flex gap-2">
      {#each sources as clickedSource}
        <button
          class="rounded-full chip {selectedSources.includes(clickedSource)
            ? 'variant-filled'
            : 'variant-soft'}"
          on:click={() => {
            if (selectedSources.includes(clickedSource)) {
              console.log("removing", clickedSource);
              console.log(selectedSources);
              selectedSources = selectedSources.filter(
                (source) => source !== clickedSource,
              );
              console.log(selectedSources);
            } else {
              selectedSources = [...selectedSources, clickedSource];
            }
          }}
          on:keypress
        >
          {#if selectedSources.includes(clickedSource)}<span
              ><CheckmarkIcon /></span
            >{/if}
          <span>{clickedSource}</span>
        </button>
      {/each}
    </div>
    <div class="size-full overflow-y-auto">
      <div
        class="grid w-full gap-2 pt-2 auto-rows-auto"
        style={`grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); box-sizing: content-box;`}
      >
        {#each filteredSounds as soundFound (soundFound.name + soundFound.url)}
          <SoundFetched sound={soundFound} />
        {/each}
      </div>
    </div>
  </div>
</div>

<DisabledInDemoPopup />
