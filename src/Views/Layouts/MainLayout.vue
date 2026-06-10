<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { PanelLeft, PanelLeftClose } from "@lucide/vue";
import AppHeader from "@/Views/Components/App/AppHeader.vue";
import AppSidebar from "@/Views/Components/App/AppSidebar.vue";
import WindowCaptionControls from "@/Views/Components/App/WindowCaptionControls.vue";
import { isMacOS } from "@/app/Platform";
import { useAuthStore } from "@/stores/auth";
import { useSessionsStore } from "@/stores/sessions";
import { useUiStore } from "@/stores/ui";

const router = useRouter();
const auth = useAuthStore();
const sessions = useSessionsStore();
const ui = useUiStore();

const firstName = computed(() => auth.user?.name?.split(" ")[0] ?? "Operator");

const sidebarProps = computed(() => ({
  sessions: sessions.sessions,
  activeSessionId: sessions.activeSessionId,
  firstName: firstName.value,
}));

const chromeIcon = { size: 16, strokeWidth: 1.75 };

async function logout() {
  await auth.logout();
  router.push({ name: "Login" });
}

function onSelectSession(sessionId) {
  sessions.selectSession(sessionId);
  if (ui.isMobile) {
    ui.closeOverlay();
  }
}

onMounted(() => ui.initLayout());
onUnmounted(() => ui.destroyLayout());
</script>

<template>
  <div
    class="relative grid h-full min-h-0 w-full"
    :class="ui.sidebarDocked ? 'grid-cols-[280px_1fr]' : 'grid-cols-1'"
  >
    <div
      v-if="ui.sidebarDocked"
      class="flex min-h-0 flex-col border-r border-[#393939]/30"
    >
      <div
        class="relative flex h-9 shrink-0 items-center border-b border-[#393939]/30 bg-[#131313]/90 px-3 backdrop-blur-xl"
        :class="isMacOS ? 'pl-[4.5rem]' : ''"
        data-tauri-drag-region
      >
        <button
          class="flex h-7 w-7 items-center justify-center rounded-md text-[#c3c3c3] transition hover:bg-[#202020] hover:text-[#e2e2e2]"
          type="button"
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          @click="ui.togglePinned()"
        >
          <PanelLeftClose v-bind="chromeIcon" />
        </button>

        <WindowCaptionControls />
      </div>

      <AppSidebar
        v-bind="sidebarProps"
        @select-session="onSelectSession"
        @logout="logout"
      />
    </div>

    <div class="flex min-h-0 min-w-0 flex-col">
      <AppHeader
        :active-session="sessions.activeSession"
        :unified="!ui.sidebarDocked"
        @nav-enter="ui.onNavTriggerEnter()"
        @nav-leave="ui.onNavTriggerLeave()"
        @nav-click="ui.onNavTriggerClick()"
      />

      <div class="flex min-h-0 min-w-0 flex-1 flex-col">
        <router-view />
      </div>
    </div>

    <Transition name="layout-scrim">
      <button
        v-if="ui.sidebarOverlayActive"
        class="absolute inset-0 z-30 bg-black/45"
        type="button"
        aria-label="Close navigation"
        @click="ui.closeOverlay()"
      />
    </Transition>

    <Transition name="sidebar-overlay">
      <div
        v-if="ui.sidebarOverlayActive"
        class="absolute bottom-2 left-2 top-2 z-40 flex w-[268px] flex-col overflow-hidden rounded-xl border border-[#393939]/40 bg-[#1c1b1b] shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
        @mouseenter="ui.onOverlayEnter()"
        @mouseleave="ui.onOverlayLeave()"
      >
        <div
          class="flex h-9 shrink-0 items-center border-b border-[#393939]/30 px-2"
        >
          <button
            v-if="!ui.isMobile"
            class="flex h-7 w-7 items-center justify-center rounded-md text-[#c3c3c3] transition hover:bg-[#202020] hover:text-[#e2e2e2]"
            type="button"
            aria-label="Pin sidebar"
            title="Pin sidebar"
            @click="ui.togglePinned()"
          >
            <PanelLeft v-bind="chromeIcon" />
          </button>
        </div>

        <AppSidebar
          class="min-h-0 flex-1"
          v-bind="sidebarProps"
          @select-session="onSelectSession"
          @logout="logout"
        />
      </div>
    </Transition>
  </div>
</template>
