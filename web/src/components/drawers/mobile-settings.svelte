<script lang="ts">
  // import MirrorIcon from "virtual:icons/mdi/mirror";
  // import CustomizedLayoutIcon from "virtual:icons/mdi/brush";
  import MirrorLayoutSettings from "../settings/mirror-layout-settings.svelte";
  import { soundpadClient } from "../../client/connections";
  import { RadioGroup, RadioItem, SlideToggle } from "@skeletonlabs/skeleton";
  import { showSearchBar, enableSoundpadColors } from "../../stores/settings";
  import { checkIsDemo } from "$lib/utils/misc";
  import { setVolume } from "$lib/demo/demo-audio";
  import { onMount } from "svelte";

  let volume = 0;
  let selectedTheme: string = localStorage.getItem("mobile-theme") || "custom-theme";

  onMount(() => {
    const root = document.body;
    root.dataset.theme = selectedTheme;
  });

  $: {
    const root = document.body;
    root.dataset.theme = selectedTheme;
    localStorage.setItem("mobile-theme", selectedTheme);
  }

  if (checkIsDemo()) {
    volume = 50;
  } else {
    soundpadClient.getVolume().then((v) => {
      volume = v;
    });
  }

  function updateVolume(event: Event) {
    if (event?.target == null) return;
    const newVolume = parseInt((event.target as HTMLInputElement).value);
    if (checkIsDemo()) {
      setVolume(newVolume / 100);
    } else {
      soundpadClient.setVolume(newVolume);
    }
    volume = newVolume;
  }
</script>

<div class="flex flex-col p-2 gap-2 text-center size-full">
  <label class="label">
    <span>Playback volume (for you only)</span>
    <div class="flex gap-2">
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        on:input={updateVolume}
      />
      {volume}%
    </div>
  </label>
  <hr />
  <div class="flex flex-col items-center gap-2">
    <span>Show search bar</span>
    <SlideToggle
      name="showSearchBar"
      active="bg-primary-500"
      size="sm"
      bind:checked={$showSearchBar}
    />
  </div>
  <div class="flex flex-col items-center gap-2">
    <span>Enable Soundpad colors</span>
    <SlideToggle
      name="enableSoundpadColors"
      active="bg-primary-500"
      size="sm"
      bind:checked={$enableSoundpadColors}
    />
  </div>
  <hr />
  <MirrorLayoutSettings />
  <!-- <hr />
  <h1>Theme</h1>

  <RadioGroup rounded="rounded-container-token" flexDirection="flex-col">
    <RadioItem bind:group={selectedTheme} name="theme" value={"wintry"}>
      <span class="flex items-center gap-2"> Original </span>
    </RadioItem>
    <RadioItem
      bind:group={selectedTheme}
      name="theme"
      value={"custom-theme-dark"}
    >
      <span class="flex items-center gap-2"> Dark </span>
    </RadioItem>
  </RadioGroup> -->

  <!-- <h1>Select layout</h1>
  <RadioGroup>
    <RadioItem bind:group={$selectedLayout} name="justify" value={'mirror'}>
      <span class="flex items-center gap-2">
        <MirrorIcon />Mirror
      </span>
    </RadioItem>
    <RadioItem bind:group={$selectedLayout} name="justify" value={'customized'}>
      <span class="flex items-center gap-2">
        <CustomizedLayoutIcon />Customized
      </span>
    </RadioItem>
  </RadioGroup>
  <hr />
  <h1>Layout settings</h1>
  <Accordion>
    <AccordionItem open={$selectedLayout === 'mirror'}>
      <svelte:fragment slot="lead"><MirrorIcon /></svelte:fragment>
      <svelte:fragment slot="summary">Mirror Layout</svelte:fragment>
      <svelte:fragment slot="content"><MirrorLayoutSettings /></svelte:fragment>
    </AccordionItem>
    <AccordionItem open={$selectedLayout === 'customized'}>
      <svelte:fragment slot="lead"><CustomizedLayoutIcon /></svelte:fragment>
      <svelte:fragment slot="summary">Customized Layout</svelte:fragment>
      <svelte:fragment slot="content"
        ><CustomizedLayoutSettingscopy /></svelte:fragment
      >
    </AccordionItem>
  </Accordion>
  <hr /> -->
</div>
