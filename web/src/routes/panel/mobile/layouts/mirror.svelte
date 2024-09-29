<script lang="ts">
  import {
    Tab,
    TabGroup,
    type PopupSettings,
    popup,
  } from "@skeletonlabs/skeleton";
  import type { Category, Sound as SoundpadSound } from "soundpad.js/lib/web";
  import Sound from "../../../../components/buttons/sound.svelte";
  import { socket, soundpadClient } from "../../../../client/connections";
  import { sounds } from "../../../../stores/sounds";
  import { onMount } from "svelte";
  import {
    mirrorLayoutSoundButtonSize,
    showSearchBar,
  } from "../../../../stores/settings";
  import fuzzy from "fuzzy";
  import { flip } from "svelte/animate";
  import { get, writable } from "svelte/store";
  import {
    SOUND_COLORS_HSL,
    generateSoundNameFromSoundpad,
    getSoundMetadata,
    getSoundName,
    setSoundMetadata,
    soundOrder,
  } from "../../../../stores/mirror-layout";
  import Sortable from "sortablejs";
  import TickIcon from "virtual:icons/mdi/tick-circle";
  import RestoreIcon from "virtual:icons/mdi/restore";
  import { checkIsDemo } from "$lib/utils/misc";
  import { demoCategories } from "$lib/demo/demo-data";

  type FlattenedCategory = Category & { depth: number };

  let sortableElement: HTMLDivElement;
  let popupTriggerButton: HTMLButtonElement;
  let popupCloseBtn: HTMLSpanElement;
  let categories: FlattenedCategory[] = [];
  let tabSet: number = 0;
  let draggingSound: SoundpadSound | undefined;
  let soundsToDisplay: SoundpadSound[] = [];
  let searchString = "";
  let header: HTMLElement;
  let headerScroll = 0;
  let soundEdited: SoundpadSound | undefined;
  let soundEditedColor: string | undefined;
  let soundEditedName = writable<string>();

  soundEditedName.subscribe((value) => {
    if (value && soundEdited) {
      setSoundMetadata(soundEdited, {
        name: value,
      });
    }
  });
  const popupFeatured: PopupSettings = {
    event: "click",
    target: "popupFeatured",
    closeQuery: "[data-popup-close]",
  };

  $: {
    if (soundEdited) {
      soundEditedColor = getSoundMetadata(soundEdited).color;
      soundEditedName.set(getSoundName(soundEdited));
    }
  }

  $: selectedCategory = categories[tabSet] as Category;

  function getActualSoundIndex(sound: SoundpadSound) {
    return get(soundOrder).indexOf(sound.url);
  }

  $: soundsInCategory =
    tabSet === 0 ? $sounds : (selectedCategory?.sounds ?? []);

  $: {
    draggingSound;
    soundsToDisplay = fuzzy
      .filter(searchString, soundsInCategory, {
        extract: getSoundName,
      })
      .map((sound) => sound.original)
      .sort((a, b) => getActualSoundIndex(a) - getActualSoundIndex(b));
  }

  socket.on("sounds", () => {
    refreshCategories();
  });

  socket.on("categories", () => {
    refreshCategories();
  });

  function refreshCategories() {
    if (checkIsDemo()) {
      categories = flattenCategories(demoCategories);
      return;
    }
    soundpadClient
      .getCategoriesJSON(true, true)
      .then((fetchedCategories: Category[]) => {
        console.log(fetchedCategories);
        categories = flattenCategories(fetchedCategories);
      });
  }

  // Flatten categories to a list of first-level categories, inserting subCategories after their parent
  function flattenCategories(
    categories: Category[],
    currentDepth = 0,
  ): FlattenedCategory[] {
    let flattenedCategories: FlattenedCategory[] = [];
    for (const category of categories) {
      flattenedCategories.push({ ...category, depth: currentDepth });
      if (category.subCategories) {
        flattenedCategories.push(
          ...flattenCategories(category.subCategories, currentDepth + 1),
        );
      }
    }
    return flattenedCategories;
  }

  onMount(() => {
    refreshCategories();

    header.addEventListener("wheel", (e) => {
      if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
      e.preventDefault();
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

    Sortable.create(sortableElement, {
      animation: 150,
      delay: 500,
      delayOnTouchOnly: true,
      // Element dragging ended
      onEnd: (evt) => {
        if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
          if (evt.oldIndex === evt.newIndex) {
            openCustomizationPopup(soundsToDisplay[evt.oldIndex], evt.item);
            return;
          }
          const movedSound = get(soundOrder)[evt.oldIndex];
          soundOrder.update((order) => {
            order.splice(evt.oldIndex!, 1);
            order.splice(evt.newIndex!, 0, movedSound);
            return order;
          });
        }
      },
    });
  });

  function openCustomizationPopup(
    sound: SoundpadSound,
    soundElement: HTMLElement,
  ) {
    popupTriggerButton.style.top =
      soundElement.getBoundingClientRect().top + "px";
    popupTriggerButton.style.left =
      soundElement.getBoundingClientRect().left + "px";
    popupTriggerButton.style.width =
      soundElement.getBoundingClientRect().width + "px";
    popupTriggerButton.style.height =
      soundElement.getBoundingClientRect().height + "px";
    soundEdited = sound;
    popupTriggerButton.click();
  }
</script>

<div
  class="flex h-full overflow-auto flex-col flex-wrap gap-4 overflow-x-hidden"
>
  <TabGroup class="w-[100vw] flex flex-col">
    <div
      bind:this={header}
      class="flex w-[100vw] border-b border-gray-400 fixed overflow-x-auto overflow-y-hidden h-20 highlighted-bar draggable z-10"
    >
      <div
        id="guide-categories"
        class="absolute size-full pointer-events-none"
      />
      {#each categories as category, index}
        <Tab class="relative" bind:group={tabSet} name="tab1" value={index}>
          {#each Array(category.depth).fill(0) as _, depth}
            <div
              class="absolute w-full -ml-4 h-0.5"
              style={`top: ${(depth + 0.5) * 0.3}rem; background-color: rgb(5 90 133)`}
            />
          {/each}
          <div class="flex h-16 flex-col items-center text-xs">
            <img
              class="h-10 w-10 aspect-square"
              src={"data:image/png;base64," + category.icon}
              style={`transform: scale(${1 - 0.1 * category.depth}) translateY(${5 * category.depth}%);`}
              alt="category icon"
            />
            <span>{category.name}</span>
          </div>
        </Tab>
      {/each}
    </div>
    <!-- Tab Panels --->
    <svelte:fragment slot="panel">
      <div id="guide-sounds-list" class="mt-16 p-2">
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
          class="grid shrink overflow-auto gap-2 pt-2 overflow-x-hidden"
          style={`grid-template-columns: repeat(auto-fill, minmax(${$mirrorLayoutSoundButtonSize}px, 1fr)); box-sizing: content-box;`}
          bind:this={sortableElement}
        >
          {#each soundsToDisplay as sound, index (sound.url + sound.index)}
            <div
              animate:flip={{ duration: 100 }}
              draggable="true"
              class={`${index === 0 ? "guide-sound" : ""} flex size-full select-none`}
              role="button"
              tabindex="0"
              on:contextmenu={(e) => {
                e.preventDefault();
                // @ts-ignore
                openCustomizationPopup(sound, e.target);
              }}
            >
              <Sound {sound} />
            </div>
          {/each}
        </div>
      </div>
    </svelte:fragment>
  </TabGroup>
</div>

<!-- Sound customization popup -->

<button
  class="invisible scale-0 absolute pointer-events-none"
  bind:this={popupTriggerButton}
  use:popup={popupFeatured}
></button>

<div class="card p-4 mt-8 shadow-xl" data-popup="popupFeatured">
  {#if soundEdited}
    <div class="mx-2 relative flex gap-2">
      <button
        class="highlight"
        on:click={() => {
          // @ts-ignore
          $soundEditedName = generateSoundNameFromSoundpad(soundEdited);
        }}
      >
        <RestoreIcon font-size="24" />
      </button>
      <input
        on:keypress={(e) => {
          if (e.key === "Enter") {
            popupCloseBtn.click();
          }
        }}
        type="text"
        class="input text-xl text-center"
        bind:value={$soundEditedName}
      />
      <span data-popup-close class="cursor-pointer" bind:this={popupCloseBtn}>
        <TickIcon font-size="32" /></span
      >
    </div>
    <div class="flex gap-4 flex-wrap mt-4">
      {#each Object.values(SOUND_COLORS_HSL) as color}
        <button
          class="btn min-w-8 aspect-square bg-secondary-800 rounded-full p-0 border-4 border-surface-500 shadow-xl"
          style={`background-color: hsl(${color} / var(--tw-bg-opacity)); border-color: ${color === soundEditedColor ? "white" : ""}`}
          on:click={() => {
            // @ts-ignore
            setSoundMetadata(soundEdited, {
              // @ts-ignore
              color,
            });
            soundEditedColor = color;
          }}
        />
      {/each}
    </div>
  {/if}
</div>
