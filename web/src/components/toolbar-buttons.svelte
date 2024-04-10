<script lang="ts">
  import StopIcon from "virtual:icons/mdi/stop";
  import RecordIcon from "virtual:icons/mdi/microphone";
  import SpeakerIcon from "virtual:icons/mdi/speaker";
  import SettingsIcon from "virtual:icons/mdi/cog";
  import { soundpadClient } from "../client/connections";
  import { getDrawerStore } from "@skeletonlabs/skeleton";
  import { DRAWER_TYPES } from "$lib/utils/enums";

  export let isSoundPlaying = true;

  const drawerStore = getDrawerStore();
</script>

<button
  type="button"
  class="btn variant-filled btn-icon variant-filled-primary"
  disabled={isSoundPlaying === false}
  on:click={() => soundpadClient.stopSound()}
>
  <span><StopIcon /></span>
</button>

<div class="flex gap-4">
  <button
    type="button"
    class="btn variant-filled btn-icon active:scale-75 select-none"
    on:contextmenu={(e) => e.preventDefault()}
    on:pointerdown={(e) => {
      e.preventDefault();
      soundpadClient.startRecordingMicrophone();
    }}
    on:pointerup={() => soundpadClient.stopRecording()}
  >
    <span><RecordIcon color="red" /></span>
  </button>

  <button
    type="button"
    class="btn variant-filled btn-icon active:scale-75 select-none"
    on:contextmenu={(e) => e.preventDefault()}
    on:pointerdown={(e) => {
      e.preventDefault();
      soundpadClient.startRecordingSpeakers();
    }}
    on:pointerup={() => soundpadClient.stopRecording()}
  >
    <span><SpeakerIcon color="red" /></span>
  </button>
</div>

<button
  type="button"
  class="btn variant-filled btn-icon variant-filled-secondary"
  on:click={() =>
    drawerStore.open({
      position: "right",
      id: DRAWER_TYPES.MOBILE_SETTINGS,
    })}
>
  <span><SettingsIcon /></span>
</button>
