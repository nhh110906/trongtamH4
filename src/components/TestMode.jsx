import { useState, useMemo, useCallback } from 'react'
import CategoryFilter from './CategoryFilter'
import ProgressBar from './ProgressBar'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function TestMode({ vocabulary }) {
  const [category, setCategory] = useState('Tất cả')
  const [started, setStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState([])

  const pool = useMemo(() => {
    if (category === 'Tất cả') return vocabulary
    return vocabulary.filter((w) => w.category === category)
  }, [vocabulary, category])

  const startTest = useCallback(() => {
    const count = Math.min(10, pool.length)
    const qs = shuffleArray(pool).slice(0, count).map((word) => {
      const others = shuffleArray(pool.filter((w) => w.id !== word.id)).slice(0, 3)
      const options = shuffleArray([word, ...others])
      return { word, options }
    })
    setQuestions(qs)
    setQIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    setAnswers([])
    setStarted(true)
  }, [pool])

  const current = questions[qIndex]

  const submit = () => {
    if (!selected || !current) return
    const correct = selected.id === current.word.id
    if (correct) setScore((s) => s + 1)
    setAnswers((a) => [...a, { word: current.word, correct, selected }])

    if (qIndex + 1 >= questions.length) {
      setFinished(true)
    } else {
      setQIndex((i) => i + 1)
      setSelected(null)
    }
  }

  if (!started) {
    return (
      <div className="mode-panel">
        <CategoryFilter selected={category} onChange={setCategory} />
        <div className="test-intro">
          <h2>Kiểm tra từ vựng</h2>
          <p>Chọn nghĩa tiếng Việt đúng cho từ tiếng Trung. Mỗi lần kiểm tra có tối đa 10 câu.</p>
          <p className="pool-info">Sẵn có: <strong>{pool.length}</strong> từ</p>
          <button type="button" className="btn btn-primary btn-lg" onClick={startTest} disabled={pool.length < 4}>
            Bắt đầu kiểm tra
          </button>
          {pool.length < 4 && <p className="error-msg">Cần ít nhất 4 từ để kiểm tra.</p>}
        </div>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="mode-panel">
        <div className="test-result">
          <h2>Kết quả kiểm tra</h2>
          <div className="score-circle">
            <span className="score-num">{score}/{questions.length}</span>
            <span className="score-pct">{pct}%</span>
          </div>
          <ProgressBar current={score} total={questions.length} label="Điểm số" />
          <div className="result-list">
            {answers.map((a, i) => (
              <div key={i} className={`result-item ${a.correct ? 'correct' : 'wrong'}`}>
                <span>{a.word.word} — {a.word.pinyin}</span>
                <span>{a.correct ? '✓' : `✗ (${a.selected.vietnamese})`}</span>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setStarted(false)}>Làm lại</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mode-panel">
      <ProgressBar current={qIndex + 1} total={questions.length} label="Tiến độ kiểm tra" />
      <div className="quiz-card">
        <span className="card-category">{current.word.category}</span>
        <h2 className="quiz-word">{current.word.word}</h2>
        <p className="quiz-pinyin">{current.word.pinyin}</p>
        <p className="quiz-prompt">Chọn nghĩa tiếng Việt đúng:</p>
        <div className="quiz-options">
          {current.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`quiz-option ${selected?.id === opt.id ? 'selected' : ''}`}
              onClick={() => setSelected(opt)}
            >
              {opt.vietnamese}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-primary" onClick={submit} disabled={!selected}>
          {qIndex + 1 === questions.length ? 'Nộp bài' : 'Tiếp theo'}
        </button>
      </div>
    </div>
  )
}
