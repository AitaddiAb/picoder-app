<script setup>
import AppHeader from '../Components/App/AppHeader.vue'

defineProps({
  isDesktop: { type: Boolean, default: false },
  isMacDesktop: { type: Boolean, default: false },
  isWindowsDesktop: { type: Boolean, default: false },
})

const emit = defineEmits(['window-control'])
</script>

<template>
  <AppHeader
    :is-desktop="isDesktop"
    :is-mac-desktop="isMacDesktop"
    :is-windows-desktop="isWindowsDesktop"
    :can-use-console="false"
    @window-control="emit('window-control', $event)"
  />
  <slot />
</template>
