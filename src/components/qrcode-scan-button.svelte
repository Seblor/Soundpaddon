<script lang="ts">
  import CameraIcon from "virtual:icons/mdi/camera";
  import CameraOffIcon from "virtual:icons/mdi/camera-off";
  import { testHostIp } from "../client/connections";
  import { Html5QrcodeScanType, Html5QrcodeScanner } from "html5-qrcode";
  import { onMount } from "svelte";
  import type { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
  import { serverHost } from "../stores/settings";
    import { getToastStore } from "@skeletonlabs/skeleton";

  const toastStore = getToastStore();

  async function onScanSuccess(decodedText: string) {
    stopScan();
    // handle the scanned code as you like, for example:
    const allLocalIPs = JSON.parse(decodedText);

    toastStore.trigger({
      hideDismiss: true,
      message: "Scanning for your device...",
    })

    Promise.allSettled(allLocalIPs.map(testHostIp)).then((results) => {
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value) {
          serverHost.update((host) => {
            host.ip = allLocalIPs[index];
            return host;
          });
          window.location.reload();
        }
      });
    });
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
    html5QrcodeScanner.clear();
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
