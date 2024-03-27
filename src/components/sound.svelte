<script lang="ts">
  import { type Sound } from "soundpad.js/web";
  import { soundpadClient } from "../client/connections";
    import { getSoundName } from "../utils/misc";

  export let sound: Sound;

  let name = getSoundName(sound);
</script>

<button
  class="btn whitespace-normal flex flex-wrap min-w-14 aspect-square text-sm bg-secondary-800 rounded overflow-hidden break-all p-0 border border-secondary-800"
  on:click={() => soundpadClient.playSound(sound.index)}
  on:keydown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      soundpadClient.playSound(sound.index);
    }
  }}
>
  {name}
</button>
