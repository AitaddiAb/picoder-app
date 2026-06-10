<script setup>
import AppHeader from '../Components/App/AppHeader.vue'
import AppSidebar from '../Components/App/AppSidebar.vue'

defineProps({
  isDesktop: { type: Boolean, default: false },
  isMacDesktop: { type: Boolean, default: false },
  isWindowsDesktop: { type: Boolean, default: false },
  activeSession: { type: Object, default: null },
  sessions: { type: Array, required: true },
  activeSessionId: { type: String, default: '' },
  firstName: { type: String, default: 'Operator' },
  sessionListOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle-sidebar', 'close-sidebar', 'select-session', 'logout', 'window-control'])
</script>

<template>
  <AppHeader
    :is-desktop="isDesktop"
    :is-mac-desktop="isMacDesktop"
    :is-windows-desktop="isWindowsDesktop"
    :can-use-console="true"
    :active-session="activeSession"
    @toggle-sidebar="emit('toggle-sidebar')"
    @window-control="emit('window-control', $event)"
  />

  <AppSidebar
    :sessions="sessions"
    :active-session-id="activeSessionId"
    :first-name="firstName"
    :open="sessionListOpen"
    @close="emit('close-sidebar')"
    @select-session="emit('select-session', $event)"
    @logout="emit('logout')"
  />

  <button v-if="sessionListOpen" class="fixed inset-0 z-40 bg-black/60 md:hidden" type="button" aria-label="Close session list" @click="emit('close-sidebar')"></button>

  <slot />
</template>
