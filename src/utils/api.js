/** Remote API base URL (Vercel). Empty in local dev — Vite proxies /api. */
export function getApiBaseUrl() {
  return (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
}

export function getCheckSentenceUrl() {
  const base = getApiBaseUrl()
  return base ? `${base}/api/check-sentence` : '/api/check-sentence'
}

export function hasRemoteApi() {
  return Boolean(getApiBaseUrl())
}
