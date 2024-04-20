<script lang="ts">
  import CameraIcon from "virtual:icons/mdi/camera";
  import CameraOffIcon from "virtual:icons/mdi/camera-off";
  import { testHostIp } from "../../client/connections";
  import { Html5QrcodeScanType, Html5QrcodeScanner } from "html5-qrcode";
  import { onMount } from "svelte";
  import type { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
  import { serverHost } from "../../stores/settings";
  import { getToastStore } from "@skeletonlabs/skeleton";
  import lz from "lz-string";
  import { isHttps } from "$lib/utils/misc";

  const toastStore = getToastStore();

  async function onScanSuccess(fullURL: string) {
    stopScan();
    const decodedText = lz.decompressFromBase64(fullURL.split("host=")[1]);
    const allLocalIPs: string[] = JSON.parse(decodedText);

    toastStore.trigger({
      hideDismiss: true,
      message: "Scanning for your device...",
    });

    const scanResults = await Promise.allSettled(
      allLocalIPs.map((ip) => testHostIp(ip, 5000)),
    );

    alert(JSON.stringify(scanResults));

    let serverFound: string | undefined = undefined;

    // Finding https server
    serverFound = allLocalIPs.find((ip, index) => {
      const scanResult = scanResults[index];
      if (scanResult.status === "fulfilled" && scanResult.value === "https") {
        return true;
      }
    });

    // If https server is not found, try http server
    if (serverFound === undefined) {
      serverFound = allLocalIPs.find((ip, index) => {
        const scanResult = scanResults[index];
        if (scanResult.status === "fulfilled" && scanResult.value === "http") {
          return true;
        }
      });

      if (serverFound && isHttps()) {
        window.location.href = `http://${serverFound}:${8556}${
          window.location.pathname + window.location.search
        }`;
        return;
      }
    }

    if (serverFound === undefined) {
      toastStore.trigger({
        hideDismiss: true,
        timeout: 3000,
        message: "Could not find your device...",
      });
      return;
    }

    toastStore.trigger({
      hideDismiss: true,
      timeout: 3000,
      message: "Found your device, connecting...",
    });

    serverHost.update((host) => {
      host.ip = serverFound!;
      host.port = isHttps() ? 8555 : 8556;
      return host;
    });

    window.location.search = "";

    setTimeout(() => {
      window.location.reload();
    }, 1e3);
  }

  let config: Html5QrcodeScannerConfig = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    videoConstraints: {
      facingMode: "environment",
    },
    rememberLastUsedCamera: true,
    // Only support camera scan type.
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
  };

  let html5QrcodeScanner: Html5QrcodeScanner;
  let scannerElement: HTMLDivElement;
  let isQrCodeScanning = false;

  onMount(() => {
    if (location.search) {
      onScanSuccess(location.search);
    }

    html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      config,
      /* verbose= */ false,
    );
  });

  function startScan() {
    isQrCodeScanning = true;
    html5QrcodeScanner.render(onScanSuccess, console.log);
  }

  function stopScan() {
    isQrCodeScanning = false;
    html5QrcodeScanner?.clear();
  }

  function buttonClick() {
    scannerElement.innerHTML === "" ? startScan() : stopScan();
  }
</script>

<div
  id="reader"
  bind:this={scannerElement}
  class={`!fixed highlighted-bar top-0 bottom-20 w-full ${isQrCodeScanning ? "" : "hidden"}`}
></div>

<button
  type="button"
  class={`btn variant-filled btn-icon active:scale-75 select-none`}
  on:click={buttonClick}
>
  <span>
    {#if isQrCodeScanning}
      <CameraOffIcon color="red" />
    {:else}
      <CameraIcon color="red" />
    {/if}
  </span>
</button>
