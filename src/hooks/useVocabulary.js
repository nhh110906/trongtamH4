import { useState, useEffect, useCallback } from 'react';
import vocabularyData from '../data/vocabulary.json';

const PROGRESS_KEY = 'hsk4-flashcard-progress';

export function useVocabulary() {
  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  const categories = [...new Set(vocabularyData.map((v) => v.category))];

  const markKnown = useCallback((id) => {
    setProgress((p) => ({ ...p, [id]: 'known' }));
  }, []);

  const markLearning = useCallback((id) => {
    setProgress((p) => ({ ...p, [id]: 'learning' }));
  }, []);

  const getStatus = useCallback((id) => progress[id] || 'new', [progress]);

  const stats = {
    total: vocabularyData.length,
    known: Object.values(progress).filter((s) => s === 'known').length,
    learning: Object.values(progress).filter((s) => s === 'learning').length,
  };

  return {
    vocabulary: vocabularyData,
    categories,
    progress,
    markKnown,
    markLearning,
    getStatus,
    stats,
  };
}

export function filterVocabulary(vocabulary, { category, status, getStatus }) {
  return vocabulary.filter((v) => {
    if (category && category !== 'all' && v.category !== category) return false;
    if (status && status !== 'all' && getStatus(v.id) !== status) return false;
    return true;
  });
}

export function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
