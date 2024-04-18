<script lang="ts">
  import DownloadIcon from "virtual:icons/mdi/download";
  import DemoIcon from "virtual:icons/mdi/eye";
  import ExternalLinkIcon from "virtual:icons/mdi/open-in-new";
  import GitHubIcon from "virtual:icons/mdi/github";
  import DiscordIcon from "virtual:icons/mdi/discord";
  import ArrowDown from "virtual:icons/mdi/arrow-downward";
  import { onMount } from "svelte";

  let features: HTMLDivElement;
  let body: HTMLDivElement;
  let scrollTop = 0;

  onMount(() => {
    body.addEventListener("scroll", () => {
      scrollTop = body.scrollTop;
    });
  });
</script>

{@html `
<script src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'></script>
<script>
  kofiWidgetOverlay.draw('seblor', {
    'type': 'floating-chat',
    'floating-chat.donateButton.text': 'Support me',
    'floating-chat.donateButton.background-color': '#00b9fe',
    'floating-chat.donateButton.text-color': '#fff'
  });
</script>`}

<div
  class="highlighted-bar flex text-xl items-center justify-between fixed left-0 right-0 top-0 h-16 border-b p-2 z-10"
>
  <div class="flex h-full items-center gap-4">
    <img src="/icon.png" class="h-full" alt="Soundpaddon icon" />
    <span class="text-3xl">Soundpaddon</span>
  </div>
  <div class="flex items-center gap-2">
    <div>
      <a
        href="https://www.leppsoft.com/soundpad/"
        class="flex items-center text-[#ce081c] text-xl font-bold gap-1"
      >
        <span>Get Soundpad</span>
        <ExternalLinkIcon />
      </a>
    </div>
    <a href="https://support.soundpaddon.app" target="_blank"><DiscordIcon /></a
    >
    <a href="https://www.github.com/Seblor/Soundpaddon" target="_blank"
      ><GitHubIcon /></a
    >
  </div>
</div>

<div
  bind:this={body}
  class="w-[100vw] mt-16 overflow-x-hidden overflow-y-auto"
  style="height: calc(100vh - 4rem)"
>
  <div class="flex flex-col items-center justify-center h-full w-[100vw] gap-8">
    <div class="flex items-center gap-4">
      <img src="/icon.png" class="h-24" alt="Soundpaddon icon" />
      <span class="text-5xl">Soundpaddon</span>
    </div>
    <span class="text-2xl">Enhance your Soudpad experience</span>
    <div class="flex gap-4">
      <a href="https://github.com/Seblor/soundpaddon/releases">
        <button class="btn variant-filled-primary"
          ><span><DownloadIcon /></span><span>Download</span></button
        >
      </a>
      <a href="/panel?demo">
        <button class="btn variant-filled-secondary"
          ><span><DemoIcon /></span><span>Try the demo</span></button
        >
      </a>
    </div>
  </div>

  <div class="flex flex-col size-full items-center gap-16" bind:this={features}>
    <div class="flex flex-col text-justify items-center w-1/2 p-8 gap-4">
      <h1 class="text-3xl">What is Soundpaddon ?</h1>
      <p>
        Soundpaddon is a free and open-source application that adds a few
        features for Soundpad.
      </p>
      <p>
        It allows you to control Soundpad remotely from any device connected to
        your local network. It also makes it fast and easy to import sounds from
        the web, YouTube, and more.
      </p>
    </div>
    <div class="flex flex-col text-justify items-center w-1/2 p-8 gap-4">
      <h1 class="text-3xl">How does it work ?</h1>
      <p>
        Soundpaddon runs on your computer and communicates with the devices you
        paired with. To pair devices, simply flash the QRCode on the screen with
        your phone, and it just works !
      </p>
      <img src="/diagram.svg" alt="Diagram representing how Soundpaddon works">
    </div>
  </div>

  <div
    class={`absolute bottom-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all ${scrollTop === 0 ? "opacity-100" : "opacity-0 scale-0"}`}
  >
    <button
      on:click={() => {
        features.scrollIntoView({ behavior: "smooth" });
      }}
      class="animate-bounce"
    >
      <ArrowDown font-size="32" />
    </button>
  </div>
</div>
