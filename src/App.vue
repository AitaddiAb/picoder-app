<script setup>
import { getCurrentWindow } from '@tauri-apps/api/window'
import { platform as osPlatform } from '@tauri-apps/plugin-os'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import AuthLayout from './Views/Layouts/AuthLayout.vue'
import MainLayout from './Views/Layouts/MainLayout.vue'
import LoginPage from './Views/Pages/Auth/LoginPage.vue'
import ChatPage from './Views/Pages/Code/ChatPage.vue'
import { useAuthStore } from './stores/auth'
import { useSessionsStore } from './stores/sessions'

const auth = useAuthStore()
const sessions = useSessionsStore()

const prompt = ref('')
const sessionListOpen = ref(false)
const chatPage = ref(null)
const isDesktop = ref(false)
const desktopPlatform = ref('')
const appWindow = getCurrentWindow()

const routePath = computed(() => window.location.pathname)
const isCallback = computed(() => routePath.value === '/auth/callback')
const firstName = computed(() => auth.user?.name?.split(' ')[0] ?? 'Operator')
const activeSession = computed(() => sessions.activeSession)
const activeMessages = computed(() => activeSession.value?.messages ?? [])
const canUseConsole = computed(() => auth.isAuthenticated || import.meta.env.DEV)
const isMacDesktop = computed(() => desktopPlatform.value === 'macos')
const isWindowsDesktop = computed(() => desktopPlatform.value === 'windows')

/**
 * Send the browser to Laravel's single Google login/register endpoint.
 */
function continueWithGoogle() {
  window.location.href = auth.googleLoginUrl
}

/**
 * Replace callback URLs with the app home after token exchange is complete.
 */
function moveHome() {
  window.history.replaceState({}, document.title, '/')
}

/**
 * Select a coding session and close the mobile session drawer.
 *
 * @param {string} sessionId Session selected from the sidebar list.
 */
function selectSession(sessionId) {
  sessions.selectSession(sessionId)
  sessionListOpen.value = false
}

/**
 * Submit the current prompt to the active session transcript.
 */
async function submitPrompt() {
  const value = prompt.value
  prompt.value = ''
  await sessions.sendPrompt(value)
}

/**
 * Keep the chat pinned to the newest streamed token.
 */
async function scrollTranscriptToBottom() {
  await nextTick()
  chatPage.value?.scrollToBottom()
}

/**
 * Drive Windows web-caption controls. macOS uses native traffic lights.
 *
 * @param {'minimize'|'maximize'|'close'} action Window action to perform.
 */
async function controlDesktopWindow(action) {
  if (!isWindowsDesktop.value) return

  if (action === 'minimize') return appWindow.minimize()
  if (action === 'maximize') return appWindow.toggleMaximize()
  if (action === 'close') return appWindow.close()
}

watch(activeMessages, scrollTranscriptToBottom, { deep: true })
watch(() => sessions.activeSessionId, scrollTranscriptToBottom)

onMounted(async () => {
  isDesktop.value = Boolean(window.__TAURI_INTERNALS__ || window.__TAURI__)
  if (isDesktop.value) {
    desktopPlatform.value = osPlatform()
  }

  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')

  if (isCallback.value && token) {
    await auth.completeGoogleLogin(token)
    moveHome()
    return
  }

  if (auth.token && !auth.user) {
    await auth.fetchUser()
  }

  await scrollTranscriptToBottom()
})
</script>

<template>
  <main class="min-h-screen bg-black font-sans text-[#e2e2e2] selection:bg-[#e87e53]/30">
    <div class="flex h-[100dvh] w-full overflow-hidden bg-[#202020] md:rounded-xl md:border md:border-[#393939]/30">
      <AuthLayout
        v-if="!canUseConsole"
        :is-desktop="isDesktop"
        :is-mac-desktop="isMacDesktop"
        :is-windows-desktop="isWindowsDesktop"
        @window-control="controlDesktopWindow"
      >
        <LoginPage :error="auth.error" :is-desktop="isDesktop" @continue-google="continueWithGoogle" />
      </AuthLayout>

      <MainLayout
        v-else
        :is-desktop="isDesktop"
        :is-mac-desktop="isMacDesktop"
        :is-windows-desktop="isWindowsDesktop"
        :active-session="activeSession"
        :sessions="sessions.sessions"
        :active-session-id="sessions.activeSessionId"
        :first-name="firstName"
        :session-list-open="sessionListOpen"
        @toggle-sidebar="sessionListOpen = !sessionListOpen"
        @close-sidebar="sessionListOpen = false"
        @select-session="selectSession"
        @logout="auth.logout()"
        @window-control="controlDesktopWindow"
      >
        <ChatPage
          ref="chatPage"
          :active-session="activeSession"
          :messages="activeMessages"
          :streaming-session-id="sessions.streamingSessionId"
          :is-streaming="sessions.isStreaming"
          :prompt="prompt"
          @update:prompt="prompt = $event"
          @submit-prompt="submitPrompt"
        />
      </MainLayout>
    </div>
  </main>
</template>
