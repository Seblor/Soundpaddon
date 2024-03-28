<script lang="ts">
  import isMobile from "is-mobile";
  import QRCode from "qrcode";
  import { onMount } from "svelte";
  import { serverHost } from "../stores/settings";
  import { get } from "svelte/store";
  import { ipToSSLDomain } from "../client/connections";

  const server = get(serverHost);

  if (isMobile() && location.href.includes("/mobile") === false) {
    location.href = "/mobile";
  }

  let qrcodeCanvas: HTMLCanvasElement;

  onMount(async () => {
    const data = await fetch(
      `https://${ipToSSLDomain(server.ip)}:${server.port}/api/data/`,
    ).then((res) => res.json());
    QRCode.toCanvas(
      qrcodeCanvas,
      JSON.stringify(data.localIPs),
      (error: any) => {
        if (error) console.error(error);
      },
    );
  });
</script>

<div class="flex gap-32 justify-center items-center w-full h-full">
  <canvas bind:this={qrcodeCanvas} />

  <iframe
    seamless
    src="/mobile"
    frameborder="0"
    title="mobile view"
    class="w-96 h-[48rem] border-8 border-black rounded-lg shadow-lg"
  ></iframe>
</div>
