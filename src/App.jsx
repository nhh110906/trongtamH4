import { useState, useMemo } from 'react'
import Header from './components/Header'
import HomePage from './components/HomePage'
import ReviewMode from './components/ReviewMode'
import TestMode from './components/TestMode'
import WriteMode from './components/WriteMode'
import vocabulary from './data/vocabulary.json'
import { filterBySection } from './utils/categories'
import './App.css'

function App() {
  const [sectionId, setSectionId] = useState(null)
  const [mode, setMode] = useState('review')

  const sectionVocabulary = useMemo(
    () => (sectionId ? filterBySection(vocabulary, sectionId) : vocabulary),
    [sectionId],
  )

  const handleSelectSection = (id) => {
    setSectionId(id)
    setMode('review')
  }

  const handleBack = () => {
    setSectionId(null)
    setMode('review')
  }

  return (
    <div className="app">
      <Header
        mode={mode}
        onModeChange={setMode}
        wordCount={sectionId ? sectionVocabulary.length : vocabulary.length}
        sectionId={sectionId}
        onBack={handleBack}
      />
      <main className="app-main">
        {!sectionId ? (
          <HomePage vocabulary={vocabulary} onSelectSection={handleSelectSection} />
        ) : (
          <>
            {mode === 'review' && <ReviewMode vocabulary={sectionVocabulary} sectionId={sectionId} />}
            {mode === 'test' && <TestMode vocabulary={sectionVocabulary} sectionId={sectionId} />}
            {mode === 'write' && <WriteMode vocabulary={sectionVocabulary} sectionId={sectionId} />}
          </>
        )}
      </main>
      <footer className="app-footer">
        <p>TrongtamH4 · Flashcard tiếng Trung — Danh từ, động từ, tính từ, phó từ, liên từ</p>
      </footer>
    </div>
  )
}

export default App
