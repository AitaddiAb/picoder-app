<script setup>
defineProps({
  isDesktop: { type: Boolean, default: false },
  isMacDesktop: { type: Boolean, default: false },
  isWindowsDesktop: { type: Boolean, default: false },
  canUseConsole: { type: Boolean, default: false },
  activeSession: { type: Object, default: null },
})

const emit = defineEmits(['toggle-sidebar', 'window-control'])
</script>

<template>
  <header
    v-if="isDesktop || canUseConsole"
    class="fixed inset-x-0 top-0 z-[70] flex h-9 items-center justify-between border-b border-[#393939]/30 bg-[#131313]/90 px-3 backdrop-blur-xl md:px-4"
    :class="isMacDesktop ? 'pl-24' : isWindowsDesktop ? 'pr-[9.75rem]' : ''"
    data-tauri-drag-region
  >
    <div class="flex min-w-0 items-center gap-2 text-sm" data-tauri-drag-region>
      <button
        v-if="canUseConsole"
        class="grid h-8 w-8 shrink-0 place-items-center rounded-md text-[#c3c3c3] transition hover:bg-[#202020] hover:text-[#e2e2e2]"
        type="button"
        title="Toggle sidebar"
        @click="emit('toggle-sidebar')"
      >
        ◨
      </button>
      <span class="hidden text-[#c3c3c3] sm:block">▱</span>
      <span class="hidden truncate font-medium text-[#e2e2e2] sm:block">{{ activeSession?.repo?.split('/')?.[0]?.trim() || 'Picoder' }}</span>
      <span v-if="canUseConsole" class="hidden text-[#c3c3c3] sm:block">/</span>
      <button v-if="canUseConsole" class="flex min-w-0 items-center gap-1 truncate text-[#c3c3c3] transition hover:text-[#e2e2e2]" type="button">
        <span class="truncate">{{ activeSession?.title }}</span>
        <span class="shrink-0 text-xs">⌄</span>
      </button>
      <span v-else class="font-medium text-[#e2e2e2]">Picoder</span>
    </div>

    <div class="ml-2 flex shrink-0 items-center gap-2">
      <button v-if="canUseConsole" class="grid h-8 w-8 place-items-center rounded-md text-[#c3c3c3] transition hover:bg-[#202020] hover:text-[#e2e2e2]" type="button" title="Search">⌕</button>
      <button v-if="canUseConsole" class="grid h-8 w-8 place-items-center rounded-md text-[#c3c3c3] transition hover:bg-[#202020] hover:text-[#e2e2e2]" type="button" title="Options">⋯</button>
    </div>

    <div v-if="isWindowsDesktop" class="windows-caption-controls">
      <button class="windows-caption-button" type="button" aria-label="Minimize window" title="Minimize" @click="emit('window-control', 'minimize')"><span aria-hidden="true">&#xE921;</span></button>
      <button class="windows-caption-button" type="button" aria-label="Maximize window" title="Maximize" @click="emit('window-control', 'maximize')"><span aria-hidden="true">&#xE922;</span></button>
      <button class="windows-caption-button windows-caption-close" type="button" aria-label="Close window" title="Close" @click="emit('window-control', 'close')"><span aria-hidden="true">&#xE8BB;</span></button>
    </div>
  </header>
</template>
