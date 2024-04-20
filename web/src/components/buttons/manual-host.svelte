<script lang="ts">
  import PenIcon from "virtual:icons/mdi/pen";
  import TickIcon from "virtual:icons/mdi/tick-circle";
  import { testHostIp } from "../../client/connections";
  import { serverHost } from "../../stores/settings";
  import {
    getToastStore,
    popup,
    type PopupSettings,
  } from "@skeletonlabs/skeleton";

  let userHost: string = "";

  const popupFeatured: PopupSettings = {
    // Represents the type of event that opens/closed the popup
    event: "click",
    // Matches the data-popup value on your popup element
    target: "popupFeatured",
    // Defines which side of your trigger the popup will appear
    placement: "top",
  };

  const toastStore = getToastStore();

  async function onHostEntered(userHost: string) {
    toastStore.trigger({
      hideDismiss: true,
      message: "Scanning for your device...",
    });

    if ((await testHostIp(userHost)) !== "offline") {
      serverHost.update((host) => {
        host.ip = userHost;
        return host;
      });

      toastStore.trigger({
        hideDismiss: true,
        timeout: 3000,
        message: "Found your device, connecting...",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1e3);
    } else {
      toastStore.trigger({
        hideDismiss: true,
        timeout: 3000,
        message: "Could not find your device",
      });
    }
  }
</script>

<button
  type="button"
  class={`btn variant-filled btn-icon active:scale-75 select-none`}
  use:popup={popupFeatured}
>
  <span>
    <PenIcon color="red" />
  </span>
</button>

<div class="card p-4 w-72 shadow-xl text-center" data-popup="popupFeatured">
  <span>Enter the host's IP address</span>
  <div class="flex gap-2">
    <label class="label">
      <input
        class="input text-center"
        type="text"
        placeholder="Input"
        bind:value={userHost}
      />
    </label>
    <div
      tabindex="0"
      role="button"
      on:click={() => onHostEntered(userHost)}
      on:keypress={(e) => {
        if (e.key === "Enter") {
          onHostEntered(userHost);
        }
      }}
    >
      <TickIcon font-size="24" />
    </div>
  </div>
</div>
