<script setup>
import { Maximize2, Minus, X } from "@lucide/vue";
import { isDesktop, isWindows } from "@/app/Platform";
import { WindowControl } from "@/lib/WindowControl";

const captionIcon = { size: 10, strokeWidth: 2 };
</script>

<template>
  <div v-if="isDesktop && isWindows" class="windows-caption-controls">
    <button
      class="windows-caption-button"
      type="button"
      aria-label="Minimize window"
      title="Minimize"
      @click="WindowControl.minimize()"
    >
      <Minus v-bind="captionIcon" />
    </button>
    <button
      class="windows-caption-button"
      type="button"
      aria-label="Maximize window"
      title="Maximize"
      @click="WindowControl.toggleMaximize()"
    >
      <Maximize2 v-bind="captionIcon" />
    </button>
    <button
      class="windows-caption-button windows-caption-close"
      type="button"
      aria-label="Close window"
      title="Close"
      @click="WindowControl.close()"
    >
      <X v-bind="captionIcon" />
    </button>
  </div>
</template>
