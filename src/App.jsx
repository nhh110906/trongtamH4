import { useState } from 'react'
import Header from './components/Header'
import ReviewMode from './components/ReviewMode'
import TestMode from './components/TestMode'
import WriteMode from './components/WriteMode'
import vocabulary from './data/vocabulary.json'
import './App.css'

function App() {
  const [mode, setMode] = useState('review')

  return (
    <div className="app">
      <Header mode={mode} onModeChange={setMode} wordCount={vocabulary.length} />
      <main className="app-main">
        {mode === 'review' && <ReviewMode vocabulary={vocabulary} />}
        {mode === 'test' && <TestMode vocabulary={vocabulary} />}
        {mode === 'write' && <WriteMode />}
      </main>
      <footer className="app-footer">
        <p>TrongtamH4 · Flashcard tiếng Trung — Danh từ, động từ, tính từ, phó từ, liên từ</p>
      </footer>
    </div>
  )
}

export default App
