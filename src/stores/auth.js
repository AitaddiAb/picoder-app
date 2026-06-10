import { defineStore } from 'pinia'
import { API_URL, apiHeaders } from '../lib/api'

const TOKEN_STORAGE_KEY = 'picoder.auth.token'

/**
 * Pinia store that owns Google OAuth token persistence and authenticated user state.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_STORAGE_KEY),
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    /** @returns {boolean} Whether the client currently has a bearer token. */
    isAuthenticated: (state) => Boolean(state.token),

    /** @returns {string} The Laravel endpoint that begins Google OAuth login/registration. */
    googleLoginUrl: () => `${API_URL}/auth/google/redirect`,
  },

  actions: {
    /**
     * Save a new bearer token and immediately load the Google-authenticated user.
     *
     * @param {string} token The token issued by the Laravel Google callback.
     */
    async completeGoogleLogin(token) {
      this.token = token
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
      await this.fetchUser()
    },

    /**
     * Load the authenticated user from Laravel Sanctum token auth.
     */
    async fetchUser() {
      if (!this.token) return

      this.loading = true
      this.error = null

      try {
        const response = await fetch(`${API_URL}/api/user`, {
          headers: apiHeaders(this.token),
        })

        if (!response.ok) {
          throw new Error('Your session expired. Please sign in with Google again.')
        }

        const payload = await response.json()
        this.user = payload.user
      } catch (error) {
        this.clearSession()
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    /**
     * Revoke the current token on the backend, then remove local auth state.
     */
    async logout() {
      const token = this.token
      this.clearSession()

      if (!token) return

      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: apiHeaders(token),
        })
      } catch {
        // Logout should remain successful locally even if the network is unavailable.
      }
    },

    /**
     * Remove all local authentication state.
     */
    clearSession() {
      this.token = null
      this.user = null
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    },
  },
})
