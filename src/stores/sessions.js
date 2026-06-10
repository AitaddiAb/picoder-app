import { defineStore } from 'pinia'

/**
 * Starter sessions used until the backend exposes real Pi agent sessions.
 */
const starterSessions = [
  {
    id: 'session-vps-relay',
    title: 'VPS relay wiring',
    repo: 'SaaSKit / picoder-api',
    branch: 'main',
    status: 'online',
    updatedAt: 'now',
    messages: [
      {
        id: 'm-1',
        role: 'assistant',
        content:
          'Connected to the remote PiCoder console. Select a task and I will stream progress here as the desktop connector executes it.',
      },
      {
        id: 'm-2',
        role: 'user',
        content: 'Check the Laravel Google auth flow and prepare the next backend relay endpoints.',
      },
      {
        id: 'm-3',
        role: 'assistant',
        content:
          'Google-only auth is in place. Next backend targets: device registration, session ownership, command relay events, and connector heartbeats.',
      },
    ],
  },
  {
    id: 'session-mobile-shell',
    title: 'Mobile app shell',
    repo: 'SaaSKit / picoder-app',
    branch: 'ui/chat',
    status: 'idle',
    updatedAt: '12m',
    messages: [
      {
        id: 'm-4',
        role: 'assistant',
        content:
          'This session is ready for frontend work. The current shell is responsive across mobile and desktop breakpoints.',
      },
    ],
  },
  {
    id: 'session-connector',
    title: 'Work PC connector',
    repo: 'local connector',
    branch: 'draft',
    status: 'offline',
    updatedAt: '1h',
    messages: [
      {
        id: 'm-5',
        role: 'assistant',
        content:
          'Connector project is not created yet. It will eventually spawn `pi --mode rpc` and bridge JSONL to the VPS relay.',
      },
    ],
  },
]

/**
 * Pinia store for the Code area: session selection, chat history, and mock streaming.
 */
export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: starterSessions,
    activeSessionId: starterSessions[0].id,
    streamingSessionId: null,
  }),

  getters: {
    /** @returns {object | undefined} The currently selected coding session. */
    activeSession: (state) => state.sessions.find((session) => session.id === state.activeSessionId),

    /** @returns {boolean} Whether any session is currently streaming output. */
    isStreaming: (state) => Boolean(state.streamingSessionId),
  },

  actions: {
    /**
     * Select a session from the sidebar and open its chat transcript.
     *
     * @param {string} sessionId The selected session identifier.
     */
    selectSession(sessionId) {
      this.activeSessionId = sessionId
    },

    /**
     * Append a user prompt and stream a placeholder assistant response.
     *
     * @param {string} prompt Prompt typed in the chat composer.
     */
    async sendPrompt(prompt) {
      const session = this.activeSession
      const trimmedPrompt = prompt.trim()

      if (!session || !trimmedPrompt || this.isStreaming) return

      session.messages.push({
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmedPrompt,
      })

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
      }

      session.messages.push(assistantMessage)
      session.updatedAt = 'now'
      session.status = 'online'
      this.streamingSessionId = session.id

      const response = this.buildStreamingResponse(trimmedPrompt, session)

      for (const character of response) {
        if (this.streamingSessionId !== session.id) break
        assistantMessage.content += character
        await new Promise((resolve) => window.setTimeout(resolve, 16))
      }

      this.streamingSessionId = null
    },

    /**
     * Create a deterministic streaming preview until real backend streaming is connected.
     *
     * @param {string} prompt The user's prompt.
     * @param {object} session The active session receiving the prompt.
     * @returns {string} Assistant response to stream into the transcript.
     */
    buildStreamingResponse(prompt, session) {
      return `Queued prompt for ${session.title}.\n\nPlan:\n1. Inspect the target files for context.\n2. Apply the smallest safe code changes.\n3. Run verification commands and report results.\n\nPrompt received:\n“${prompt}”\n\nBackend streaming will replace this local preview once the VPS relay and desktop connector are wired.`
    },
  },
})
