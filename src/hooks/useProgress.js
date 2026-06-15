import { useState, useEffect } from 'react'

const STORAGE_KEY = 'flashcard-progress'

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const markKnown = (id) => {
    setProgress((prev) => ({ ...prev, [id]: { known: true, date: Date.now() } }))
  }

  const getKnownCount = (ids) => ids.filter((id) => progress[id]?.known).length

  return { progress, markKnown, getKnownCount }
}
