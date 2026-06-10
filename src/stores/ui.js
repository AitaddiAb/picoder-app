import { defineStore } from "pinia";
import { isMobile as platformIsMobile } from "@/app/Platform";

const DARK_MODE_KEY = "picoder.ui.darkModeEnabled";
const SIDEBAR_PINNED_KEY = "picoder.ui.sidebarPinned";
const SIDEBAR_OPENED_KEY = "picoder.ui.sidebarOpened";
const MOBILE_BREAKPOINT = 768;

function readSidebarPinned() {
  const pinned = localStorage.getItem(SIDEBAR_PINNED_KEY);
  if (pinned !== null) return pinned !== "false";

  const legacy = localStorage.getItem(SIDEBAR_OPENED_KEY);
  if (legacy !== null) return legacy !== "false";

  return true;
}

/**
 * Pinia store for client UI preferences and responsive layout state.
 */
export const useUiStore = defineStore("ui", {
  state: () => ({
    darkModeEnabled: localStorage.getItem(DARK_MODE_KEY) !== "false",
    isPinned: readSidebarPinned(),
    isHovered: false,
    overlayOpen: false,
    viewportMobile: false,
    _resizeListener: null,
    _hoverCloseTimer: null,
  }),

  getters: {
    isMobile: (state) => state.viewportMobile || platformIsMobile,

    /** Sidebar occupies a permanent left grid column (desktop pinned). */
    sidebarDocked(state) {
      return state.isPinned && !this.isMobile;
    },

    /** Floating overlay card is visible above the workspace. */
    sidebarOverlayActive(state) {
      if (this.sidebarDocked) return false;
      return state.isHovered || state.overlayOpen;
    },

    /** Sidebar content is visible in either docked or overlay form. */
    sidebarVisible() {
      return this.sidebarDocked || this.sidebarOverlayActive;
    },
  },

  actions: {
    initLayout() {
      this.updateViewport();
      this._resizeListener = () => this.updateViewport();
      window.addEventListener("resize", this._resizeListener);
    },

    destroyLayout() {
      if (this._resizeListener) {
        window.removeEventListener("resize", this._resizeListener);
        this._resizeListener = null;
      }
      this.clearHoverCloseTimer();
    },

    updateViewport() {
      this.viewportMobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (this.isMobile) {
        this.isHovered = false;
      }
    },

    toggleDarkMode() {
      this.darkModeEnabled = !this.darkModeEnabled;
      localStorage.setItem(DARK_MODE_KEY, String(this.darkModeEnabled));
    },

    togglePinned() {
      this.isPinned = !this.isPinned;
      localStorage.setItem(SIDEBAR_PINNED_KEY, String(this.isPinned));
      if (this.isPinned) {
        this.overlayOpen = false;
        this.isHovered = false;
      }
    },

    openOverlay() {
      this.overlayOpen = true;
    },

    closeOverlay() {
      this.overlayOpen = false;
      this.isHovered = false;
    },

    toggleOverlay() {
      if (this.overlayOpen) {
        this.closeOverlay();
      } else {
        this.openOverlay();
      }
    },

    setSidebarHovered(value) {
      if (this.isMobile) return;
      this.clearHoverCloseTimer();
      this.isHovered = value;
    },

    scheduleSidebarHoverClose() {
      if (this.isMobile) return;
      this.clearHoverCloseTimer();
      this._hoverCloseTimer = setTimeout(() => {
        this.isHovered = false;
        this._hoverCloseTimer = null;
      }, 120);
    },

    clearHoverCloseTimer() {
      if (this._hoverCloseTimer) {
        clearTimeout(this._hoverCloseTimer);
        this._hoverCloseTimer = null;
      }
    },

    onNavTriggerEnter() {
      if (this.isMobile) return;
      this.setSidebarHovered(true);
    },

    onNavTriggerLeave() {
      if (this.isMobile) return;
      this.scheduleSidebarHoverClose();
    },

    onOverlayEnter() {
      if (this.isMobile) return;
      this.setSidebarHovered(true);
    },

    onOverlayLeave() {
      if (this.isMobile) return;
      this.scheduleSidebarHoverClose();
    },

    onNavTriggerClick() {
      if (this.isMobile) {
        this.toggleOverlay();
      }
    },
  },
});
