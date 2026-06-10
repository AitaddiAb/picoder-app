/**
 * Base URL for the PiCoder Laravel API.
 *
 * Configure this in `.env` with `VITE_API_URL=http://localhost:8000` when needed.
 */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

/**
 * Build default JSON API headers, including an optional bearer token.
 *
 * @param {string | null} token The Sanctum personal access token returned by Google login.
 * @returns {Record<string, string>} Headers suitable for Laravel JSON APIs.
 */
export function apiHeaders(token = null) {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}
