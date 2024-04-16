<script lang="ts">
  import { inject } from '@vercel/analytics';
  import "../app.postcss";
  // @ts-ignore
  import { pwaInfo } from "virtual:pwa-info";
  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";

  inject();
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

<slot />
