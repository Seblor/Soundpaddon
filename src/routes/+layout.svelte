<script lang="ts">
  import "../app.postcss";
  // @ts-ignore
  import { pwaInfo } from "virtual:pwa-info";
  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

<slot />
