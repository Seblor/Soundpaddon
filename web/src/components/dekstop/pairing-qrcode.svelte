<script lang="ts">
  import QRCode from "qrcode";
  import { onMount } from "svelte";
  import lz from "lz-string";
  import { ipToSSLDomain } from "../../client/connections";
  import { get } from "svelte/store";
  import { serverHost } from "../../stores/settings";
  import { checkIsDemo, isHttps } from "$lib/utils/misc";

  const server = get(serverHost);

  let qrcodeCanvas: HTMLCanvasElement;

  onMount(async () => {
    if (checkIsDemo()) {
      QRCode.toCanvas(
        qrcodeCanvas,
        `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        (error: any) => {
          if (error) console.error(error);
        },
      );
      return;
    }
    const data = await fetch(
      `${isHttps() ? 'https' : 'http'}://${isHttps() ? ipToSSLDomain(server.ip) : location.hostname}:${server.port}/api/data`,
    ).then((res) => res.json());
    QRCode.toCanvas(
      qrcodeCanvas,
      `https://soundpaddon.app/panel?host=${lz.compressToBase64(JSON.stringify(data.localIPs))}`,
      (error: any) => {
        if (error) console.error(error);
      },
    );
  });
</script>

<canvas bind:this={qrcodeCanvas} />
