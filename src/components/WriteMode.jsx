import { useState } from 'react'
import SectionBanner from './SectionBanner'
import { basicSentenceCheck } from '../utils/basicSentenceCheck'
import { getCheckSentenceUrl, hasRemoteApi } from '../utils/api'

export default function WriteMode({ vocabulary, sectionId }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [sentence, setSentence] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const current = vocabulary[wordIndex] || vocabulary[0]

  const checkSentence = async () => {
    if (!sentence.trim()) {
      setError('Vui lòng nhập câu ví dụ.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      let data
      try {
        const res = await fetch(getCheckSentenceUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            word: current.word,
            sentence: sentence.trim(),
            example: current.example,
          }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Lỗi kiểm tra')
        data = json
      } catch {
        data = basicSentenceCheck(
          current.word,
          sentence.trim(),
          current.example || '',
        )
      }
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const nextWord = () => {
    setWordIndex((i) => (i + 1) % vocabulary.length)
    setSentence('')
    setResult(null)
    setError('')
  }

  if (!current) {
    return <p className="empty-msg">Không có từ vựng trong phần này.</p>
  }

  return (
    <div className="mode-panel">
      <SectionBanner sectionId={sectionId} wordCount={vocabulary.length} />

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

        {!hasRemoteApi() && import.meta.env.BASE_URL !== '/' && (
          <p className="write-offline-note">
            Chưa cấu hình API serverless — dùng kiểm tra cơ bản offline. Xem README để bật đánh giá AI trên mọi thiết bị.
          </p>
        )}

        {!hasRemoteApi() && import.meta.env.BASE_URL === '/' && (
          <p className="write-offline-note">
            Chạy local với <code>npm run dev</code> và API key để dùng AI. Hoặc cấu hình Vercel theo README để dùng AI trên GitHub Pages.
          </p>
        )}

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
