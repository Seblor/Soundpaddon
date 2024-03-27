<script lang="ts">
  import CameraIcon from "virtual:icons/mdi/camera";
  import { testHostIp } from "../client/connections";
  import {
    Html5QrcodeScanType,
    Html5QrcodeScanner,
  } from "html5-qrcode";
  import { onMount } from "svelte";
  import type { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
    import { serverHost } from "../stores/settings";
    import { get } from "svelte/store";

  async function onScanSuccess(decodedText: string) {
    stopScan();
    // handle the scanned code as you like, for example:
    const allLocalIPs = JSON.parse(decodedText);

    while (allLocalIPs.length > 0) {
      const localIP = allLocalIPs.pop();
      if (await testHostIp(localIP)) {
        serverHost.update((host) => {
          host.ip = localIP;
          return host;
        });
        window.location.reload();
      }
    }
  }

  let config: Html5QrcodeScannerConfig = {
    fps: 10,
    rememberLastUsedCamera: true,
    // Only support camera scan type.
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
  };

  let html5QrcodeScanner: Html5QrcodeScanner;
  let scannerElement: HTMLDivElement;

  onMount(() => {
    html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      config,
      /* verbose= */ false,
    );
  });

  function startScan() {
    html5QrcodeScanner.render(onScanSuccess, console.log);
  }

  function stopScan() {
    html5QrcodeScanner.clear();
  }

  function buttonClick() {
    scannerElement.innerHTML === "" ? startScan() : stopScan();
  }
</script>

<div
  id="reader"
  bind:this={scannerElement}
  class="!fixed highlighted-bar top-0 bottom-20 w-full border"
></div>

<button
  type="button"
  class="btn variant-filled btn-icon active:scale-75 select-none"
  on:click={buttonClick}
>
  <span><CameraIcon color="red" /></span>
</button>
