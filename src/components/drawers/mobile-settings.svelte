<script lang="ts">
  // import MirrorIcon from "virtual:icons/mdi/mirror";
  // import CustomizedLayoutIcon from "virtual:icons/mdi/brush";
  import MirrorLayoutSettings from "../settings/mirror-layout-settings.svelte";
  import { soundpadClient } from "../../client/connections";
  import { SlideToggle, getDrawerStore } from "@skeletonlabs/skeleton";
  import { showSearchBar } from "../../stores/settings";
  import InstallPwa from "../install-pwa.svelte";

  let volume = 0;
  let drawerStore = getDrawerStore();

  soundpadClient.getVolume().then((v) => {
    volume = v;
  });

  function updateVolume(event: Event) {
    if (event?.target == null) return;
    soundpadClient.setVolume(
      parseInt((event.target as HTMLInputElement).value),
    );
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
  <hr />
  <MirrorLayoutSettings />
  <InstallPwa />
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
