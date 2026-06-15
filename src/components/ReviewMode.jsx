import { useState, useMemo } from 'react'
import FlashCard from './FlashCard'
import CategoryFilter from './CategoryFilter'
import ProgressBar from './ProgressBar'
import { useProgress } from '../hooks/useProgress'

export default function ReviewMode({ vocabulary }) {
  const [category, setCategory] = useState('Tất cả')
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const { progress, markKnown, getKnownCount } = useProgress()

  const filtered = useMemo(() => {
    if (category === 'Tất cả') return vocabulary
    return vocabulary.filter((w) => w.category === category)
  }, [vocabulary, category])

  const current = filtered[index] || null
  const knownCount = getKnownCount(filtered.map((w) => w.id))

  const handleCategory = (cat) => {
    setCategory(cat)
    setIndex(0)
    setFlipped(false)
  }

  const next = () => {
    setFlipped(false)
    setIndex((i) => (i + 1) % filtered.length)
  }

  const prev = () => {
    setFlipped(false)
    setIndex((i) => (i - 1 + filtered.length) % filtered.length)
  }

  const shuffle = () => {
    setFlipped(false)
    setIndex(Math.floor(Math.random() * filtered.length))
  }

  if (!current) {
    return <p className="empty-msg">Không có từ vựng trong danh mục này.</p>
  }

  return (
    <div className="mode-panel">
      <CategoryFilter selected={category} onChange={handleCategory} />
      <ProgressBar current={knownCount} total={filtered.length} label="Tiến độ ôn tập" />

      <div className="card-counter">
        Thẻ {index + 1} / {filtered.length}
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
