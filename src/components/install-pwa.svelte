<script lang="ts">
  import { onMount } from "svelte";

  let installButton: HTMLButtonElement;
  let deferredPrompt: Event | null;

  onMount(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      deferredPrompt = e;
      console.log({ deferredPrompt });
    });

    installButton.addEventListener("click", async () => {
      //@ts-ignore
      deferredPrompt?.prompt();
      //@ts-ignore
      const { outcome } = await deferredPrompt?.userChoice;
      deferredPrompt = null;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt.");
      } else if (outcome === "dismissed") {
        console.log("User dismissed the install prompt");
      }
    });
  });
</script>

<button bind:this={installButton} class="btn bg-primary-500">Install</button>
