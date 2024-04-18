<script lang="ts">
  import { inject } from "@vercel/analytics";

  import "../app.postcss";
  // @ts-ignore
  import { pwaInfo } from "virtual:pwa-info";
  import { checkIsDemo } from "$lib/utils/misc";
  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";

  import { driverConfig } from "$lib/demo/configs";

  import { driver, type DriveStep } from "driver.js";
  import "driver.js/dist/driver.css"; // This will be stripped in production build, so the CSS has been copied bellow to be forced into the header (https://github.com/sveltejs/svelte/issues/5804)
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
  <style>
    .driver-active .driver-overlay,.driver-active *{pointer-events:none}.driver-active .driver-active-element,.driver-active .driver-active-element *,.driver-popover,.driver-popover *{pointer-events:auto}@keyframes animate-fade-in{0%{opacity:0}to{opacity:1}}.driver-fade .driver-overlay{animation:animate-fade-in .2s ease-in-out}.driver-fade .driver-popover{animation:animate-fade-in .2s}.driver-popover{all:unset;box-sizing:border-box;color:#2d2d2d;margin:0;padding:15px;border-radius:5px;min-width:250px;max-width:300px;box-shadow:0 1px 10px #0006;z-index:1000000000;position:fixed;top:0;right:0;background-color:#fff}.driver-popover *{font-family:Helvetica Neue,Inter,ui-sans-serif,"Apple Color Emoji",Helvetica,Arial,sans-serif}.driver-popover-title{font:19px/normal sans-serif;font-weight:700;display:block;position:relative;line-height:1.5;zoom:1;margin:0}.driver-popover-close-btn{all:unset;position:absolute;top:0;right:0;width:32px;height:28px;cursor:pointer;font-size:18px;font-weight:500;color:#d2d2d2;z-index:1;text-align:center;transition:color;transition-duration:.2s}.driver-popover-close-btn:hover,.driver-popover-close-btn:focus{color:#2d2d2d}.driver-popover-title[style*=block]+.driver-popover-description{margin-top:5px}.driver-popover-description{margin-bottom:0;font:14px/normal sans-serif;line-height:1.5;font-weight:400;zoom:1}.driver-popover-footer{margin-top:15px;text-align:right;zoom:1;display:flex;align-items:center;justify-content:space-between}.driver-popover-progress-text{font-size:13px;font-weight:400;color:#727272;zoom:1}.driver-popover-footer button{all:unset;display:inline-block;box-sizing:border-box;padding:3px 7px;text-decoration:none;text-shadow:1px 1px 0 #fff;background-color:#fff;color:#2d2d2d;font:12px/normal sans-serif;cursor:pointer;outline:0;zoom:1;line-height:1.3;border:1px solid #ccc;border-radius:3px}.driver-popover-footer .driver-popover-btn-disabled{opacity:.5;pointer-events:none}:not(body):has(>.driver-active-element){overflow:hidden!important}.driver-no-interaction,.driver-no-interaction *{pointer-events:none!important}.driver-popover-footer button:hover,.driver-popover-footer button:focus{background-color:#f7f7f7}.driver-popover-navigation-btns{display:flex;flex-grow:1;justify-content:flex-end}.driver-popover-navigation-btns button+button{margin-left:4px}.driver-popover-arrow{content:"";position:absolute;border:5px solid #fff}.driver-popover-arrow-side-over{display:none}.driver-popover-arrow-side-left{left:100%;border-right-color:transparent;border-bottom-color:transparent;border-top-color:transparent}.driver-popover-arrow-side-right{right:100%;border-left-color:transparent;border-bottom-color:transparent;border-top-color:transparent}.driver-popover-arrow-side-top{top:100%;border-right-color:transparent;border-bottom-color:transparent;border-left-color:transparent}.driver-popover-arrow-side-bottom{bottom:100%;border-left-color:transparent;border-top-color:transparent;border-right-color:transparent}.driver-popover-arrow-side-center{display:none}.driver-popover-arrow-side-left.driver-popover-arrow-align-start,.driver-popover-arrow-side-right.driver-popover-arrow-align-start{top:15px}.driver-popover-arrow-side-top.driver-popover-arrow-align-start,.driver-popover-arrow-side-bottom.driver-popover-arrow-align-start{left:15px}.driver-popover-arrow-align-end.driver-popover-arrow-side-left,.driver-popover-arrow-align-end.driver-popover-arrow-side-right{bottom:15px}.driver-popover-arrow-side-top.driver-popover-arrow-align-end,.driver-popover-arrow-side-bottom.driver-popover-arrow-align-end{right:15px}.driver-popover-arrow-side-left.driver-popover-arrow-align-center,.driver-popover-arrow-side-right.driver-popover-arrow-align-center{top:50%;margin-top:-5px}.driver-popover-arrow-side-top.driver-popover-arrow-align-center,.driver-popover-arrow-side-bottom.driver-popover-arrow-align-center{left:50%;margin-left:-5px}.driver-popover-arrow-none{display:none}

  </style>
</svelte:head>

<slot />
