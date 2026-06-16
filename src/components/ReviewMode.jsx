import { useState } from 'react'
import FlashCard from './FlashCard'
import ProgressBar from './ProgressBar'
import SectionBanner from './SectionBanner'
import { useProgress } from '../hooks/useProgress'

export default function ReviewMode({ vocabulary, sectionId }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const { progress, markKnown, getKnownCount } = useProgress()

  const current = vocabulary[index] || null
  const knownCount = getKnownCount(vocabulary.map((w) => w.id))

  const next = () => {
    setFlipped(false)
    setIndex((i) => (i + 1) % vocabulary.length)
  }

  const prev = () => {
    setFlipped(false)
    setIndex((i) => (i - 1 + vocabulary.length) % vocabulary.length)
  }

  const shuffle = () => {
    setFlipped(false)
    setIndex(Math.floor(Math.random() * vocabulary.length))
  }

  if (!current) {
    return <p className="empty-msg">Không có từ vựng trong phần này.</p>
  }

  return (
    <div className="mode-panel">
      <SectionBanner sectionId={sectionId} wordCount={vocabulary.length} />
      <ProgressBar current={knownCount} total={vocabulary.length} label="Tiến độ ôn tập" />

      <div className="card-counter">
        Thẻ {index + 1} / {vocabulary.length}
      </div>

      <FlashCard word={current} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />

      <div className="card-actions">
        <button type="button" className="btn btn-secondary" onClick={prev}>← Trước</button>
        <button type="button" className="btn btn-accent" onClick={shuffle}>Ngẫu nhiên</button>
        <button
          type="button"
          className={`btn ${progress[current.id]?.known ? 'btn-known' : 'btn-primary'}`}
          onClick={() => markKnown(current.id)}
        >
          {progress[current.id]?.known ? '✓ Đã thuộc' : 'Đánh dấu đã thuộc'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={next}>Sau →</button>
      </div>
    </div>
  )
}
