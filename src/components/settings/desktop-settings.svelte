<script lang="ts">
  import { AUTOSTART_ACTIONS } from "$lib/utils/enums";
  import { SlideToggle } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let isAutostart = writable(false);

  isAutostart.subscribe((value) => {
    fetch("/api/autostart", {
      method: "POST",
      headers: {
        "Content-Type": "plain/text",
      },
      body:
        process.env.NODE_ENV === "production" && value
          ? AUTOSTART_ACTIONS.ENABLE
          : AUTOSTART_ACTIONS.DISABLE,
    });
  });

  onMount(async () => {
    isAutostart.set(
      (await fetch("/api/autostart", {
        method: "POST",
        headers: {
          "Content-Type": "plain/text",
        },
        body: AUTOSTART_ACTIONS.GET,
      }).then((res) => res.text())) === "true",
    );
  });
</script>

<div class="flex items-center gap-2">
  <SlideToggle
    size="sm"
    name="isLandscapeAdaptorGrid"
    active="bg-primary-500"
    bind:checked={$isAutostart}
  />
  Start with Windows
</div>
