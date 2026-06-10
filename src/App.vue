<script setup>
import { getCurrentWindow } from '@tauri-apps/api/window'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import { useSessionsStore } from './stores/sessions'

const auth = useAuthStore()
const sessions = useSessionsStore()

const prompt = ref('')
const activeMenu = ref('code')
const sessionListOpen = ref(false)
const transcriptEl = ref(null)
const isDesktop = ref(false)
const appWindow = getCurrentWindow()

const routePath = computed(() => window.location.pathname)
const isCallback = computed(() => routePath.value === '/auth/callback')
const firstName = computed(() => auth.user?.name?.split(' ')[0] ?? 'Operator')
const activeSession = computed(() => sessions.activeSession)
const activeMessages = computed(() => activeSession.value?.messages ?? [])
const canUseConsole = computed(() => auth.isAuthenticated || import.meta.env.DEV)

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
 * Open the Code section and reveal the session list on compact screens.
 */
function openCodeMenu() {
  activeMenu.value = 'code'
  sessionListOpen.value = true
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
  if (transcriptEl.value) {
    transcriptEl.value.scrollTop = transcriptEl.value.scrollHeight
  }
}

/**
 * Drive Tauri's frameless desktop window controls. No-op in the browser.
 *
 * @param {'minimize'|'maximize'|'close'} action Window action to perform.
 */
async function controlDesktopWindow(action) {
  if (!isDesktop.value) return

  if (action === 'minimize') return appWindow.minimize()
  if (action === 'maximize') return appWindow.toggleMaximize()
  if (action === 'close') return appWindow.close()
}

watch(activeMessages, scrollTranscriptToBottom, { deep: true })
watch(() => sessions.activeSessionId, scrollTranscriptToBottom)

onMounted(async () => {
  isDesktop.value = Boolean(window.__TAURI_INTERNALS__ || window.__TAURI__)

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
  <main class="min-h-screen overflow-hidden bg-[#070907] text-stone-100 selection:bg-lime-300 selection:text-black">
    <div class="pointer-events-none fixed inset-0 opacity-70">
      <div class="absolute left-[-12rem] top-[-12rem] h-96 w-96 rounded-full bg-lime-400/20 blur-3xl"></div>
      <div class="absolute bottom-[-10rem] right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-emerald-500/15 blur-3xl"></div>
      <div class="absolute inset-0 bg-[linear-gradient(rgba(190,255,130,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(190,255,130,0.045)_1px,transparent_1px)] bg-[size:42px_42px]"></div>
    </div>

    <div
      v-if="isDesktop"
      class="fixed inset-x-0 top-0 z-[70] flex h-9 items-center justify-end border-b border-lime-200/10 bg-[#050705]/80 px-2 backdrop-blur-xl"
      data-tauri-drag-region
    >
      <div class="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.34em] text-lime-200/35 sm:block" data-tauri-drag-region>Picoder</div>
      <div class="flex items-center gap-1.5">
        <button class="desktop-window-control text-amber-100 hover:border-amber-300/45 hover:bg-amber-300/20" type="button" aria-label="Minimize window" title="Minimize" @click="controlDesktopWindow('minimize')">
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.25 6.25h7.5" /></svg>
        </button>
        <button class="desktop-window-control text-lime-100 hover:border-lime-300/45 hover:bg-lime-300/20" type="button" aria-label="Toggle maximize window" title="Maximize" @click="controlDesktopWindow('maximize')">
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.25 3.25h5.5v5.5h-5.5z" /></svg>
        </button>
        <button class="desktop-window-control text-red-100 hover:border-red-300/45 hover:bg-red-400/25" type="button" aria-label="Close window" title="Close" @click="controlDesktopWindow('close')">
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.2 3.2l5.6 5.6M8.8 3.2L3.2 8.8" /></svg>
        </button>
      </div>
    </div>

    <section v-if="!canUseConsole" class="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10" :class="isDesktop ? 'pt-14' : ''">
      <header class="flex items-center justify-between border-b border-lime-200/10 pb-5">
        <div class="flex items-center gap-3">
          <div class="grid h-10 w-10 place-items-center rounded-2xl border border-lime-200/20 bg-lime-300 text-sm font-black text-black shadow-[0_0_35px_rgba(190,242,100,0.25)]">π</div>
          <div>
            <p class="font-serif text-xl italic tracking-tight text-lime-100">PiCoder</p>
            <p class="font-mono text-[10px] uppercase tracking-[0.34em] text-lime-200/45">remote agent console</p>
          </div>
        </div>
      </header>

      <div class="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <section class="relative z-10">
          <p class="mb-5 inline-flex rounded-full border border-lime-200/15 bg-lime-200/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.28em] text-lime-200/70">Google-only access</p>
          <h1 class="max-w-3xl font-serif text-6xl italic leading-[0.88] tracking-[-0.06em] text-lime-50 sm:text-7xl lg:text-8xl">Control your coding agent from anywhere.</h1>
          <p class="mt-7 max-w-xl text-lg leading-8 text-stone-400">Sign in or register with Google to open your remote coding sessions.</p>
          <div v-if="auth.error" class="mt-6 max-w-xl rounded-2xl border border-red-300/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">{{ auth.error }}</div>
          <button class="group mt-9 inline-flex items-center justify-center gap-3 rounded-full bg-lime-300 px-6 py-4 font-mono text-sm font-bold uppercase tracking-[0.18em] text-black shadow-[0_20px_80px_rgba(190,242,100,0.25)] transition hover:-translate-y-0.5 hover:bg-lime-200" type="button" @click="continueWithGoogle">
            <span class="grid h-6 w-6 place-items-center rounded-full bg-white font-sans text-base font-black">G</span>
            Continue with Google
            <span class="transition group-hover:translate-x-1">→</span>
          </button>
        </section>
      </div>
    </section>

    <section v-else class="relative grid grid-rows-[auto_1fr] overflow-hidden lg:grid-cols-[5.25rem_22rem_1fr] lg:grid-rows-1" :class="isDesktop ? 'mt-9 h-[calc(100vh-2.25rem)]' : 'h-screen'">
      <nav class="z-30 flex items-center justify-between border-b border-lime-200/10 bg-[#080a08]/90 px-4 py-3 backdrop-blur-xl lg:flex-col lg:border-b-0 lg:border-r lg:px-3 lg:py-5">
        <div class="flex items-center gap-3 lg:flex-col">
          <div class="grid h-11 w-11 place-items-center rounded-2xl bg-lime-300 font-black text-black shadow-[0_0_40px_rgba(190,242,100,0.28)]">π</div>
          <button
            class="grid h-11 w-11 place-items-center rounded-2xl border text-lg transition"
            :class="activeMenu === 'code' ? 'border-lime-300/40 bg-lime-300/15 text-lime-200' : 'border-stone-800 text-stone-500 hover:border-stone-600 hover:text-stone-200'"
            type="button"
            title="Code sessions"
            @click="openCodeMenu"
          >
            &lt;/&gt;
          </button>
        </div>

        <div class="flex items-center gap-3 lg:flex-col">
          <div class="hidden text-center font-mono text-[10px] uppercase tracking-[0.2em] text-stone-600 lg:block">{{ firstName }}</div>
          <button class="rounded-full border border-stone-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 transition hover:border-red-300/40 hover:text-red-100" type="button" @click="auth.logout()">Logout</button>
        </div>
      </nav>

      <aside
        class="fixed inset-y-0 left-0 z-40 w-[88vw] max-w-sm border-r border-lime-200/10 bg-[#0c0f0b]/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-2xl transition-transform duration-300 lg:static lg:z-10 lg:w-auto lg:max-w-none lg:translate-x-0 lg:bg-[#0c0f0b]/80"
        :class="sessionListOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="mb-5 flex items-center justify-between">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-[0.34em] text-lime-200/45">tap code</p>
            <h2 class="font-serif text-3xl italic tracking-tight text-lime-50">Sessions</h2>
          </div>
          <button class="rounded-full border border-stone-800 px-3 py-2 text-stone-400 lg:hidden" type="button" @click="sessionListOpen = false">✕</button>
        </div>

        <div class="space-y-3 overflow-y-auto pb-24 lg:h-[calc(100vh-7rem)] lg:pb-3">
          <button
            v-for="session in sessions.sessions"
            :key="session.id"
            class="w-full rounded-[1.35rem] border p-4 text-left transition hover:-translate-y-0.5 hover:border-lime-200/30 hover:bg-lime-200/5"
            :class="session.id === sessions.activeSessionId ? 'border-lime-300/35 bg-lime-300/10 shadow-[0_18px_70px_rgba(190,242,100,0.08)]' : 'border-stone-800 bg-black/20'"
            type="button"
            @click="selectSession(session.id)"
          >
            <div class="mb-3 flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold text-stone-100">{{ session.title }}</p>
                <p class="mt-1 font-mono text-xs text-stone-500">{{ session.repo }}</p>
              </div>
              <span class="rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]" :class="session.status === 'online' ? 'bg-lime-300/15 text-lime-200' : session.status === 'idle' ? 'bg-amber-300/15 text-amber-200' : 'bg-stone-700/50 text-stone-400'">{{ session.status }}</span>
            </div>
            <div class="flex items-center justify-between font-mono text-[11px] text-stone-500">
              <span>{{ session.branch }}</span>
              <span>{{ session.updatedAt }}</span>
            </div>
          </button>
        </div>
      </aside>

      <button v-if="sessionListOpen" class="fixed inset-0 z-30 bg-black/60 lg:hidden" type="button" aria-label="Close session list" @click="sessionListOpen = false"></button>

      <section class="grid min-h-0 grid-rows-[auto_1fr_auto] bg-[#070907]/70">
        <header class="border-b border-lime-200/10 bg-[#070907]/75 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div class="flex items-center justify-between gap-4">
            <div class="min-w-0">
              <button class="mb-2 rounded-full border border-stone-800 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 lg:hidden" type="button" @click="sessionListOpen = true">Sessions</button>
              <h1 class="truncate font-serif text-3xl italic tracking-tight text-lime-50 sm:text-4xl">{{ activeSession?.title }}</h1>
              <p class="mt-1 truncate font-mono text-xs text-stone-500">{{ activeSession?.repo }} · {{ activeSession?.branch }}</p>
            </div>
            <div class="rounded-2xl border border-lime-200/10 bg-black/30 px-4 py-3 text-right font-mono text-xs">
              <p class="uppercase tracking-[0.22em] text-stone-500">stream</p>
              <p :class="sessions.isStreaming ? 'text-lime-300' : 'text-stone-300'">{{ sessions.isStreaming ? 'receiving' : 'ready' }}</p>
            </div>
          </div>
        </header>

        <div ref="transcriptEl" class="min-h-0 overflow-y-auto px-4 py-5 sm:px-6 lg:px-10">
          <div class="mx-auto max-w-4xl space-y-5">
            <article
              v-for="message in activeMessages"
              :key="message.id"
              class="flex gap-3"
              :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[88%] whitespace-pre-wrap rounded-[1.5rem] border px-4 py-3 leading-7 shadow-xl sm:max-w-[76%]"
                :class="message.role === 'user' ? 'border-lime-300/30 bg-lime-300 text-black shadow-lime-950/20' : 'border-stone-800 bg-[#10140f] text-stone-200 shadow-black/30'"
              >
                <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.24em]" :class="message.role === 'user' ? 'text-black/55' : 'text-lime-200/45'">{{ message.role === 'user' ? 'you' : 'pi agent' }}</p>
                {{ message.content }}<span v-if="sessions.streamingSessionId === activeSession?.id && message === activeMessages[activeMessages.length - 1]" class="ml-1 inline-block h-4 w-2 animate-pulse bg-lime-300 align-middle"></span>
              </div>
            </article>
          </div>
        </div>

        <form class="border-t border-lime-200/10 bg-[#080a08]/95 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10" @submit.prevent="submitPrompt">
          <div class="mx-auto flex max-w-4xl flex-col gap-3 rounded-[1.75rem] border border-lime-200/15 bg-black/40 p-3 shadow-2xl shadow-black/40 sm:flex-row sm:items-end">
            <label class="sr-only" for="prompt">Prompt</label>
            <textarea
              id="prompt"
              v-model="prompt"
              class="min-h-24 flex-1 resize-none bg-transparent px-2 py-2 text-base leading-7 text-stone-100 outline-none placeholder:text-stone-600 sm:min-h-16"
              placeholder="Ask Pi to edit files, run tests, inspect errors..."
              rows="2"
              @keydown.enter.exact.prevent="submitPrompt"
            ></textarea>
            <button
              class="rounded-2xl bg-lime-300 px-5 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-40"
              type="submit"
              :disabled="!prompt.trim() || sessions.isStreaming"
            >
              Send
            </button>
          </div>
        </form>
      </section>
    </section>
  </main>
</template>
