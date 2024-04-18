<script lang="ts">
  import { inject } from "@vercel/analytics";

  import "../app.postcss";
  // @ts-ignore
  import { pwaInfo } from "virtual:pwa-info";
  import { checkIsDemo } from "$lib/utils/misc";
  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";

  import { driverConfig } from "$lib/demo/configs";

  import { driver, type DriveStep } from "driver.js";
  import "driver.js/dist/driver.css";
  import { onMount } from "svelte";

  const desktopGuideSteps: DriveStep[] = [
    {
      popover: {
        title: "Welcome !",
        description:
          "Wellcome to Soundpaddon, I will guide you through the features available to you !",
      },
    },
    {
      element: "#guide-mobile-preview",
      popover: {
        title: "Interactive Mobile Preview",
        description: `Preview what will be shown on your mobile device here.<br><span class="text-bold">You can interact with it, this demo will emulate Soundpad !</span>`,
      },
    },
    {
      element: ".guide-pair-section",
      popover: {
        title: "Pairing section",
        description:
          "This sections allows you to pair your devices to control soundpad.",
      },
    },
    {
      element: ".guide-youtube-import-section",
      popover: {
        title: "Youtube import section",
        description:
          "This sections allows you to import sounds from youtube videos.",
      },
    },
    {
      element: ".guide-soundbanks-import-section",
      popover: {
        title: "Soundbanks import section",
        description:
          "This sections allows you to import sounds from various soundbanks.",
      },
    },
    {
      element: ".guide-extract-import-section",
      popover: {
        title: "Website import section",
        description:
          "This sections allows you to import all sounds found in a web page.",
      },
    },
  ];

  const mobileSteps: DriveStep[] = [
    {
      element: "#guide-categories",
      popover: {
        title: "Categories",
        description:
          "Those are the categories from Soundpad. Keep in mind that subcategories are ignored.",
      },
    },
    {
      element: "#guide-sounds-list",
      popover: {
        title: "Sounds list",
        description:
          "Here are your sounds, you can drag and drop the sounds them to reorder them.",
      },
    },
    {
      element: ".guide-sound",
      popover: {
        title: "Sound button",
        description:
          "Long press (on mobile) or right click on a sound to customize it !",
      },
    },
    {
      element: "#guide-record-btns",
      popover: {
        title: "Record buttons",
        description: `Those buttons will record your microphone or speaker as long as they are pressed.<br /><br />Don't forget to disable the "Recorder" notifications in the settings to remove the delay !`,
      },
    },
  ];

  onMount(() => {
    const guide = driver({
      ...driverConfig,
      steps: location.href.includes("desktop")
        ? desktopGuideSteps
        : mobileSteps,
    });

    if (checkIsDemo()) {
      guide.drive();
    }
  });

  inject();
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

<slot />
