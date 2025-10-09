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
  document.querySelector('.floatingchat-container').setAttribute('title', 'Support me on Ko-fi');
</script>`}

<div
  class="highlighted-bar flex text-xl items-center justify-between fixed left-0 right-0 top-0 h-16 border-b p-2 z-10"
>
  <div class="flex h-full items-center gap-4">
    <img src="/logo.svg" class="h-full" alt="Soundpaddon icon" />
    <span class="text-xl sm:text-3xl">Soundpaddon</span>
  </div>
  <div class="flex items-center gap-2">
    <div>
      <a
        href="https://www.leppsoft.com/soundpad/"
        class="text-[#ce081c] text-xl font-bold"
      >
        <img class="inline sm:hidden" src="/soundpad.png" alt="Soundpad icon" />
        <div class="hidden sm:flex items-center gap-1">
          <span>Get Soundpad</span>
          <ExternalLinkIcon />
        </div>
      </a>
    </div>
    <a href="https://support.soundpaddon.app" aria-label="Support Discord server" target="_blank"><DiscordIcon /></a
    >
    <a href="https://www.github.com/Seblor/Soundpaddon" aria-label="Find the code on Github" target="_blank"
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
      <img src="/logo.svg" class="h-12 sm:h-24" alt="Soundpaddon icon" />
      <span class="text-2xl sm:text-5xl">Soundpaddon</span>
    </div>
    <span class="sm:text-2xl">Enhance your Soundpad experience</span>
    <div class="flex flex-wrap justify-center gap-4">
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
    <div class="flex flex-col items-center md:w-1/2 p-8 gap-4">
      <h1 class="text-3xl text-center">What is Soundpaddon?</h1>
      <p class="text-justify">
        Soundpaddon is a free and open-source application that adds a few
        features for Soundpad.
      </p>
      <p class="text-justify">
        It allows you to control Soundpad remotely from any device connected to
        your local network. It also makes it fast and easy to import sounds from
        the web, YouTube, and more.
      </p>
    </div>
    <div class="flex flex-col items-center md:w-1/2 p-8 gap-4">
      <h1 class="text-3xl text-center">How does it work ?</h1>
      <p class="text-justify">
        Soundpaddon runs on your computer and communicates with the devices you
        paired with. To pair devices, simply flash the QRCode on the screen with
        your phone, and it just works !
      </p>
      <img
        src="/diagram.svg"
        alt="Diagram representing how Soundpaddon works"
      />
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
      aria-label="Name"
    >
      <ArrowDown font-size="32" />
    </button>
  </div>
</div>
