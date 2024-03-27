<script lang="ts">
  import Sound from "../../../components/sound.svelte";
  import { mirrorLayoutSoundButtonSize } from "../../../stores/settings";
  import { sounds } from "../../../stores/sounds";
</script>

<div
  class="flex h-full overflow-auto flex-col flex-wrap gap-4 overflow-x-hidden"
>
  <div class="w-[100vw] flex flex-col">
    <div
      class="flex w-[100vw] border-b border-gray-400 absolute overflow-x-auto h-20 highlighted-bar draggable z-10"
    >
      Header
    </div>
    <div
      class="grid shrink overflow-auto h-[300vh] mt-18 gap-2 p-2"
      style={`grid-template-columns: repeat(auto-fill, minmax(${$mirrorLayoutSoundButtonSize}px, 1fr)); box-sizing: content-box;`}
    >
      {#each $sounds as sound (sound.index)}
        <Sound {sound} />
      {/each}
    </div>
  </div>
</div>
