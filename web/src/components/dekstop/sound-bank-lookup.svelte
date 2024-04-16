<script lang="ts">
  import { getEndpointUrl } from "$lib/utils/api";
  import LoadingIcon from "virtual:icons/mdi/loading";
  import PencilIcon from "virtual:icons/mdi/pencil";
  import _ from "lodash";
  import type { FetchedSound } from "$lib/api-return-types";
  import SoundFetched from "./sound-fetched.svelte";
  import { onMount } from "svelte";
    import { initAudioPreviewer } from "$lib/preview-audio";

  let searchFilter = "";
  // let soundsFound: FetchedSound[] = [];
  let soundsFound: FetchedSound[] = new Array(58).fill(undefined);
  soundsFound = soundsFound.map((_, i) => ({
    name: "Sound " + i,
    source: "freesound",
    url: "https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_5MB_MP3.mp3",
  }));
  let isFetching = false;

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
        class="input h-8 px-2 text-center"
        type="text"
        disabled={isFetching}
        placeholder="Search a sound"
        bind:value={searchFilter}
        on:input={() => searchSounds()}
      />
      {#if isFetching}
        <LoadingIcon class="absolute right-2 top-2 animate-spin !-mt-0.5" />
      {/if}
    </label>
    <div class="size-full overflow-y-auto">
      <div
        class="grid w-full gap-2 pt-2 auto-rows-auto"
        style={`grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); box-sizing: content-box;`}
      >
        {#each soundsFound as soundFound (soundFound.name + soundFound.url)}
          <SoundFetched sound={soundFound} />
        {/each}
      </div>
    </div>
  </div>
</div>
