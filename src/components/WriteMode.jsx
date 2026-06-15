import { useState } from 'react'
import CategoryFilter from './CategoryFilter'
import vocabulary from '../data/vocabulary.json'

export default function WriteMode() {
  const [category, setCategory] = useState('Tất cả')
  const [wordIndex, setWordIndex] = useState(0)
  const [sentence, setSentence] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const filtered = category === 'Tất cả'
    ? vocabulary
    : vocabulary.filter((w) => w.category === category)

  const current = filtered[wordIndex] || vocabulary[0]

  const checkSentence = async () => {
    if (!sentence.trim()) {
      setError('Vui lòng nhập câu ví dụ.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/check-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: current.word,
          sentence: sentence.trim(),
          example: current.example,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Lỗi kiểm tra')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const nextWord = () => {
    setWordIndex((i) => (i + 1) % filtered.length)
    setSentence('')
    setResult(null)
    setError('')
  }

  return (
    <div className="mode-panel">
      <CategoryFilter selected={category} onChange={(c) => { setCategory(c); setWordIndex(0); setSentence(''); setResult(null) }} />

      <div className="write-card">
        <span className="card-category">{current.category}</span>
        <h2 className="write-word">{current.word}</h2>
        <p className="write-pinyin">{current.pinyin} — {current.vietnamese}</p>

        <div className="write-example-ref">
          <p className="ref-label">Câu mẫu:</p>
          <p>{current.example}</p>
          <p className="example-py">{current.examplePinyin}</p>
          <p className="example-vi">{current.exampleVietnamese}</p>
        </div>

        <label className="write-label" htmlFor="sentence">
          Viết câu ví dụ của bạn (dùng từ &ldquo;{current.word}&rdquo;):
        </label>
        <textarea
          id="sentence"
          className="write-input"
          rows={3}
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          placeholder={`Ví dụ: ${current.example}`}
        />

        {error && <p className="error-msg">{error}</p>}

        {result && (
          <div className={`check-result ${result.correct ? 'correct' : 'wrong'}`}>
            <p className="result-status">{result.correct ? '✓ Đúng!' : '✗ Cần cải thiện'}</p>
            <p>{result.feedback}</p>
            {result.suggestions && <p className="suggestions">💡 {result.suggestions}</p>}
          </div>
        )}

        <div className="write-actions">
          <button type="button" className="btn btn-secondary" onClick={nextWord}>Từ khác</button>
          <button type="button" className="btn btn-primary" onClick={checkSentence} disabled={loading}>
            {loading ? 'Đang kiểm tra...' : 'Kiểm tra câu'}
          </button>
        </div>
      </div>
    </div>
  )
}
