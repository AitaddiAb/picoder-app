/**
 * Tauri window controls for desktop shells.
 *
 * @module WindowControl
 */

import { isDesktop } from "@/app/Platform";
import { getCurrentWindow } from "@tauri-apps/api/window";

export const WindowControl = {
  async minimize() {
    if (!isDesktop) return;
    try {
      await getCurrentWindow().minimize();
    } catch (error) {
      console.error("Failed to minimize window:", error);
    }
  },

  async toggleMaximize() {
    if (!isDesktop) return;
    try {
      await getCurrentWindow().toggleMaximize();
    } catch (error) {
      console.error("Failed to toggle maximize window:", error);
    }
  },

  async close() {
    if (!isDesktop) return;
    try {
      await getCurrentWindow().close();
    } catch (error) {
      console.error("Failed to close window:", error);
    }
  },
};
