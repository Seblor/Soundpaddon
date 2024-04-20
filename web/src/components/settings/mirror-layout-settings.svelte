<script>
  import {
    makeDrawerOpaque,
    makeDrawerTransparent,
    mirrorLayoutSoundButtonSize,
  } from "../../stores/settings";
</script>

<label class="label">
  <span>Minimum sound button size</span>
  <div class="flex gap-2">
    <input
      type="range"
      min="30"
      max="100"
      on:pointerdown={makeDrawerTransparent}
      on:pointerup={makeDrawerOpaque}
      bind:value={$mirrorLayoutSoundButtonSize}
    />
    {$mirrorLayoutSoundButtonSize}px
  </div>
</label>
