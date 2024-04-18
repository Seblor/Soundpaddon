import type { PopupSettings } from "@skeletonlabs/skeleton";

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function checkIsDemo() {
  return (window.top ?? window).location.href.includes('?demo')
}

export const demoPopupConfig: PopupSettings = {
  event: "hover",
  target: "disabledDemo",
  placement: "top",
};
