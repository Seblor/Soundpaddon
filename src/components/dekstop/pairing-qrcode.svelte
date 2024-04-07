<script lang="ts">
  import QRCode from "qrcode";
  import { onMount } from "svelte";
  import lz from "lz-string";
  import { ipToSSLDomain } from "../../client/connections";
  import { get } from "svelte/store";
  import { serverHost } from "../../stores/settings";

  const server = get(serverHost);

  let qrcodeCanvas: HTMLCanvasElement;

  onMount(async () => {
    const data = await fetch(
      `https://${ipToSSLDomain(server.ip)}:${server.port}/api/data/`,
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
