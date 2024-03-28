<script lang="ts">
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import type { Category } from "soundpad.js/web";
  import Sound from "../../../components/sound.svelte";
  import { socket, soundpadClient } from "../../../client/connections";
  import { sounds } from "../../../stores/sounds";
  import { onMount } from "svelte";
  import {
    mirrorLayoutSoundButtonSize,
    showSearchBar,
  } from "../../../stores/settings";
  import { getSoundName } from "../../../utils/misc";
  import fuzzy from 'fuzzy'

  let categories: Category[] = [];

  let tabSet: number = 0;

  $: selectedCategory = categories[tabSet] as Category;

  $: soundsInCategory = tabSet === 0 ? $sounds : selectedCategory?.sounds ?? [];

  // @ts-ignore
  $: soundsToDisplay = fuzzy.filter(searchString, soundsInCategory, {
    extract: getSoundName,
  }).map((sound) => sound.original);

  let searchString = "";

  socket.on("sounds", () => {
    refreshCategories();
  });

  function refreshCategories() {
    soundpadClient.getCategoriesJSON(true, true).then((fetchedCategories) => {
      categories = fetchedCategories;
    });
  }

  refreshCategories();

  let header: HTMLElement;
  let headerScroll = 0;

  onMount(() => {
    header.addEventListener("wheel", (e) => {
      if (e.shiftKey || e.ctrlKey || e.altKey) return;
      headerScroll = Math.max(
        0,
        Math.min(
          header.scrollWidth - header.clientWidth,
          headerScroll + e.deltaY,
        ),
      );
      header.scroll({
        left: headerScroll,
        behavior: "smooth",
      });
    });
  });
</script>

<div
  class="flex h-full overflow-auto flex-col flex-wrap gap-4 overflow-x-hidden"
>
  <TabGroup class="w-[100vw] flex flex-col">
    <div
      bind:this={header}
      class="flex w-[100vw] border-b border-gray-400 fixed overflow-x-auto overflow-y-hidden h-20 highlighted-bar draggable z-10"
    >
      {#each categories as category, index}
        <Tab bind:group={tabSet} name="tab1" value={index}>
          <div class="flex h-16 flex-col items-center text-xs">
            <img
              class="h-10 w-10 aspect-square"
              src={"data:image/png;base64," + category.icon}
              alt="category icon"
            />
            <span>{category.name}</span>
          </div>
        </Tab>
      {/each}
    </div>
    <!-- Tab Panels --->
    <svelte:fragment slot="panel">
      <div class="mt-16 p-2">
        {#if $showSearchBar}
          <div class="flex items-center gap-2">
            <input
              type="search"
              placeholder="Search sounds"
              class="w-full h-8 p-2 rounded-lg border text-black border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              bind:value={searchString}
            />
          </div>
        {/if}
        <div
          class="grid shrink overflow-auto gap-2 pt-2"
          style={`grid-template-columns: repeat(auto-fill, minmax(${$mirrorLayoutSoundButtonSize}px, 1fr)); box-sizing: content-box;`}
        >
          {#each soundsToDisplay as sound (sound.index)}
            <Sound {sound} />
          {/each}
        </div>
      </div>
    </svelte:fragment>
  </TabGroup>
</div>
