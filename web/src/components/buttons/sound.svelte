<script lang="ts">
  import { type Sound } from "soundpad.js/lib/web";
  import { soundpadClient } from "../../client/connections";
  import {
    getSoundMetadata,
    getSoundName,
    soundMetadata,
  } from "../../stores/mirror-layout";
  import { checkIsDemo } from "$lib/utils/misc";
  import { playAudio } from "$lib/demo/demo-audio";
  import { mirrorLayoutSoundButtonSize } from "../../stores/settings";

  export let sound: Sound;

  $: isDemo = checkIsDemo();

  let name = getSoundMetadata(sound).name;
  let color = getSoundMetadata(sound).color;

  soundMetadata.subscribe(() => {
    name = getSoundMetadata(sound).name;
    color = getSoundMetadata(sound).color;
  });
</script>

<button
  class="btn whitespace-normal grow flex flex-wrap aspect-square text-sm bg-secondary-800 rounded overflow-hidden p-0 border border-secondary-800"
  style={`word-break: break-word; line-height: 1.5; background-color: hsl(${color} / var(--tw-bg-opacity));border-color: hsl(${color} / var(--tw-bg-opacity)); font-size: ${Math.max(10, ($mirrorLayoutSoundButtonSize - name.length * 0.5) / 4)}px`}
  on:click={() =>
    isDemo ? playAudio(sound.url) : soundpadClient.playSound(sound.index)}
  on:keydown={(event) => {
    event.preventDefault();
  }}
>
  {name}
</button>
