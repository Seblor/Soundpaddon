<script lang="ts">
  import { type Sound } from "soundpad.js/web";
  import { soundpadClient } from "../client/connections";
  import { SOUND_COLORS_HSL, getSoundMetadata, getSoundName, soundMetadata } from "../stores/mirror-layout";

  export let sound: Sound;

  let name = getSoundMetadata(sound).name;
  let color = getSoundMetadata(sound).color;

  soundMetadata.subscribe(() => {
  name = getSoundMetadata(sound).name;
  color = getSoundMetadata(sound).color;
  });

</script>

<button
  class="btn whitespace-normal grow flex flex-wrap min-w-14 aspect-square text-sm bg-secondary-800 rounded overflow-hidden break-all p-0 border border-secondary-800"
  style={`background-color: hsl(${color} / var(--tw-bg-opacity));border-color: hsl(${color} / var(--tw-bg-opacity));`}
  on:click={() => soundpadClient.playSound(sound.index)}
  on:keydown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      soundpadClient.playSound(sound.index);
    }
  }}
>
  {name}
</button>
