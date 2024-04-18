<script lang="ts">
  import { checkIsDemo } from "$lib/utils/misc";
</script>

{#if checkIsDemo()}
  <div class="card p-4 variant-filled-primary" data-popup="disabledDemo">
    <p>Disabled in demo</p>
    <div class="arrow variant-filled-primary" />
  </div>
{/if}
