import type { Config } from "driver.js";

export const shownDrivers = new Set<string>();

export const driverConfig: Config = {
  popoverClass: "guide",
  showProgress: true,
  nextBtnText: "Next",
  prevBtnText: "Previous",
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
}