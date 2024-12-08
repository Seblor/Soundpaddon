import type { PopupSettings } from "@skeletonlabs/skeleton";

export function sleep (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function checkIsDemo () {
  return (window.top ?? window).location.href.includes('?demo')
}

export const demoPopupConfig: PopupSettings = {
  event: "hover",
  target: "disabledDemo",
  placement: "top",
};

export function isHttps () {
  return window.location.protocol === "https:"
};

export function rgbToHsl (rgb: string): string {
  const [r, g, b] = rgb.split(/(..)/).filter(a => a).map(num => parseInt(num, 16) / 255);

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return `${h * 360} ${s * 100}% ${l * 100}%`;
}
