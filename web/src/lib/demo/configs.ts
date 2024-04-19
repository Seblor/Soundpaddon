import { checkIsDemo } from "$lib/utils/misc";
import { localStorageStore } from "@skeletonlabs/skeleton";
import type { Config } from "driver.js";
import { get } from "svelte/store";

const _shownDrivers = localStorageStore<Record<string, boolean>>('demo', {});

export const shownDrivers = checkIsDemo() ? new Set() : {
  has: (id: string): boolean => {
    return id in get(_shownDrivers)
  },
  add: (id: string): void => {
    _shownDrivers.update((drivers) => {
      drivers[id] = true;
      return drivers;
    })
  },
};

export const driverStyleConfig: Config = {
  popoverClass: "guide",
  onPopoverRender(popover, opts) {
    popover.nextButton.classList.add(
      "!btn",
      "!btn-sm",
      "!variant-filled-primary",
      "!border-0",
      "!color-white",
      "![text-shadow:none]",
    );
    popover.previousButton.classList.add(
      "!btn",
      "!btn-sm",
      "!variant-filled-primary",
      "!border-0",
      "!color-white",
      "![text-shadow:none]",
    );
  }
};

export const driverConfig: Config = {
  showProgress: true,
  nextBtnText: "Next",
  prevBtnText: "Previous",
  ...driverStyleConfig
};
