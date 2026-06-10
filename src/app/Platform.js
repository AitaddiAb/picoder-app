/**
 * Runtime platform detection for Tauri desktop, Capacitor mobile, and browser.
 *
 * @module Platform
 */

import { isTauri as isTauriFn } from "@tauri-apps/api/core";
import { type } from "@tauri-apps/plugin-os";
import { Capacitor } from "@capacitor/core";

const isTauri = isTauriFn();
const isCapacitor = Capacitor.isNativePlatform();
const isNative = isTauri || isCapacitor;

/** OS slug: `windows`, `macos`, `linux`, `android`, `ios`, or `browser`. */
export const platform = isTauri
  ? type()
  : isCapacitor
    ? Capacitor.getPlatform()
    : "browser";

export { isTauri, isCapacitor };
export const isWeb = !isNative;
export const isNativePlatform = isNative;

/** Tauri desktop targets (Linux excluded until supported). */
export const isDesktop = ["windows", "macos"].includes(platform);
export const isMobile = ["android", "ios"].includes(platform);
export const isMacOS = platform === "macos";
export const isWindows = platform === "windows";
export const isLinux = platform === "linux";
export const isAndroid = platform === "android";
export const isIOS = platform === "ios";

const Platform = {
  install(app) {
    app.config.globalProperties.$platform = platform;
    app.config.globalProperties.$isTauri = isTauri;
    app.config.globalProperties.$isCapacitor = isCapacitor;
    app.config.globalProperties.$isNative = isNative;
    app.config.globalProperties.$isWeb = isWeb;
    app.config.globalProperties.$isDesktop = isDesktop;
    app.config.globalProperties.$isMobile = isMobile;
    app.config.globalProperties.$isMacOS = isMacOS;
    app.config.globalProperties.$isWindows = isWindows;
    app.config.globalProperties.$isLinux = isLinux;
    app.config.globalProperties.$isAndroid = isAndroid;
    app.config.globalProperties.$isIOS = isIOS;
  },
};

export default Platform;

if (typeof window !== "undefined") {
  console._warn = console.warn;
  console.warn = (...args) => {
    const message = args.join(" ");
    if (
      message.includes("[TAURI]") &&
      message.includes("Couldn't find callback id")
    ) {
      if (!console._tauri_hmr_warn) {
        console.debug("[tauri] Some async operations lost callback IDs.");
        console._tauri_hmr_warn = true;
      }
    } else {
      console._warn(...args);
    }
  };
}
