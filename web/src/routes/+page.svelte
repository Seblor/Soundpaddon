<script lang="ts">
  import DownloadIcon from "virtual:icons/mdi/download";
  import Guide from "../components/showcase/guide.svelte";
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
  class="flex flex-col items-center justify-center h-[100vh] w-[100vw] gap-8"
>
  <div class="flex items-center gap-4">
    <img src="/icon.png" class="h-24" alt="Soundpaddon icon" />
    <span class="text-5xl">Soundpaddon</span>
  </div>
  <span class="text-2xl">Enhance your Soudpad experience</span>
  <div>
    <a href="https://github.com/Seblor/soundpaddon/releases">
      <button class="btn variant-filled-primary"
        ><span><DownloadIcon /></span><span>Download</span></button
      >
    </a>
  </div>
</div>
<div class="h-[100vh] w-[100vw] border">
  <Guide />
</div>
