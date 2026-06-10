<script setup>
import { Menu } from "@lucide/vue";
import { isDesktop, isMacOS } from "@/app/Platform";
import WindowCaptionControls from "@/Views/Components/App/WindowCaptionControls.vue";

defineProps({
  activeSession: { type: Object, default: null },
  unified: { type: Boolean, default: false },
});

const emit = defineEmits(["nav-enter", "nav-leave", "nav-click"]);

const navIcon = { size: 16, strokeWidth: 1.75 };
</script>

<template>
  <header
    v-if="isDesktop || unified"
    class="relative z-10 flex h-9 shrink-0 items-center border-b border-[#393939]/30 bg-[#131313]/90 backdrop-blur-xl"
    :class="[
      unified && isMacOS ? 'pl-[4.5rem]' : 'px-3 md:px-4',
      !unified ? 'border-l-0' : '',
    ]"
    data-tauri-drag-region
  >
    <WindowCaptionControls v-if="unified" />

    <button
      v-if="unified"
      class="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#c3c3c3] transition hover:bg-[#202020] hover:text-[#e2e2e2]"
      type="button"
      aria-label="Open navigation"
      title="Navigation"
      @click="emit('nav-click')"
      @mouseenter="emit('nav-enter')"
      @mouseleave="emit('nav-leave')"
    >
      <Menu v-bind="navIcon" />
    </button>

    <div
      class="flex min-w-0 flex-1 items-center gap-2 px-3 text-sm md:px-0"
      data-tauri-drag-region
    >
      <span class="truncate font-medium text-[#e2e2e2]">{{
        activeSession?.repo?.split("/")?.[0]?.trim() || "Picoder"
      }}</span>
      <span class="text-[#c3c3c3]">/</span>
      <span class="truncate text-[#c3c3c3]">{{
        activeSession?.title || "Session"
      }}</span>
    </div>
  </header>
</template>
