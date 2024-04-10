<script lang="ts">
  import {
    SlideToggle,
    type ModalSettings,
    getModalStore,
  } from "@skeletonlabs/skeleton";
  import {
    customizedLayoutSoundColumns,
    customizedLayoutSoundRows,
  } from "../../stores/settings";
  import MinusIcon from "virtual:icons/mdi/minus";
  import PlusIcon from "virtual:icons/mdi/plus";
  import QuestionMarkIcon from "virtual:icons/mdi/help-circle";
    import { customizedLayoutLandscapeAdaptor } from "../../stores/customized-layout";

  const modalStore = getModalStore();

  let orientationExplanationModal: HTMLDivElement;

  function landscapeAdaptorChange(event: Event) {
    if (event?.target == null) return;
    $customizedLayoutLandscapeAdaptor =
      (event.target as HTMLInputElement).checked === true ? "grid" : "list";
  }

  function showOrientationExplanationModal() {
    const modal: ModalSettings = {
      type: "alert",
      // Data
      title: "Sounds disposition in landscape orientation",
      body: orientationExplanationModal.innerHTML,
      buttonTextCancel: "Close",
    };

    modalStore.trigger(modal);
  }
</script>

<div class="flex flex-col items-center gap-4">
  <label class="flex flex-col items-center label">
    <span>Default number of columns</span>
    <div class="btn-group variant-filled h-7 text-xl">
      <button class="!px-3" on:click={() => $customizedLayoutSoundColumns--}
        ><MinusIcon /></button
      >
      <input
        class="w-10 text-center"
        maxlength="3"
        type="number"
        min="1"
        bind:value={$customizedLayoutSoundColumns}
      />
      <button class="!px-3" on:click={() => $customizedLayoutSoundColumns++}
        ><PlusIcon /></button
      >
    </div>
  </label>

  <hr class="w-1/2" />

  <label class="flex flex-col items-center label">
    <span>Default number of rows</span>
    <div class="btn-group variant-filled h-7 text-xl">
      <button class="!px-3" on:click={() => $customizedLayoutSoundRows--}
        ><MinusIcon /></button
      >
      <input
        class="w-10 text-center"
        maxlength="3"
        type="number"
        min="1"
        bind:value={$customizedLayoutSoundRows}
      />
      <button class="!px-3" on:click={() => $customizedLayoutSoundRows++}
        ><PlusIcon /></button
      >
    </div>
  </label>

  <hr class="w-1/2" />

  <div class="flex flex-col items-center label">
    <span>Sounds disposition in landscape orientation</span>
    <div class="flex gap-2 py-2 items-center relative">
      <span>List</span>
      <SlideToggle
        size="sm"
        name="isLandscapeAdaptorGrid"
        active="bg-primary-500"
        checked={$customizedLayoutLandscapeAdaptor === "grid"}
        on:change={landscapeAdaptorChange}
      />
      <span>Grid</span>
      <button
        class="absolute text-secondary-500 right-0 -mr-12"
        on:click={showOrientationExplanationModal}
      >
        <QuestionMarkIcon font-size="32" />
      </button>
    </div>
  </div>
</div>

<div class="hidden" bind:this={orientationExplanationModal}>
  <div class="flex gap-8 items-center">
    <img src="/img/layout_base.png" alt="portrait layout" />
    <div class="flex justify-between gap-4">
      <div class="flex flex-col gap-2 items-center">
        <span> List layout </span>
        <img src="/img/layout_list.png" alt="list layout" />
      </div>
      <div class="flex flex-col gap-2 items-center">
        <span> Grid layout </span>
        <img src="/img/layout_grid.png" alt="grid layout" />
      </div>
    </div>
  </div>
</div>
