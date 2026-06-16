import { useMemo } from 'react'
import { SECTIONS, filterBySection } from '../utils/categories'
import { useProgress } from '../hooks/useProgress'

export default function HomePage({ vocabulary, onSelectSection }) {
  const { getKnownCount } = useProgress()

  const sections = useMemo(
    () =>
      SECTIONS.map((section) => {
        const words = filterBySection(vocabulary, section.id)
        const known = getKnownCount(words.map((w) => w.id))
        return { ...section, count: words.length, known }
      }),
    [vocabulary, getKnownCount],
  )

  const totalKnown = sections.reduce((sum, s) => sum + s.known, 0)

  return (
    <div className="home-page">
      <div className="home-hero">
        <h2>Chọn phần học</h2>
        <p>
          Từ vựng được chia thành các phần riêng biệt. Mỗi phần có chế độ ôn tập,
          kiểm tra và viết câu riêng.
        </p>
        <p className="home-stats">
          Tổng cộng <strong>{vocabulary.length}</strong> từ · Đã thuộc{' '}
          <strong>{totalKnown}</strong> từ
        </p>
      </div>

      <div className="section-grid">
        {sections.map((section) => {
          const pct = section.count > 0 ? Math.round((section.known / section.count) * 100) : 0
          return (
            <button
              key={section.id}
              type="button"
              className="section-card"
              style={{ '--section-color': section.color }}
              onClick={() => onSelectSection(section.id)}
            >
              <div className="section-card-header">
                <span className="section-icon">{section.icon}</span>
                <div className="section-titles">
                  <h3>{section.label}</h3>
                  <span className="section-chinese">{section.chinese}</span>
                </div>
              </div>
              <p className="section-desc">{section.description}</p>
              <div className="section-meta">
                <span className="section-count">{section.count} từ</span>
                <span className="section-progress">
                  {section.known}/{section.count} đã thuộc ({pct}%)
                </span>
              </div>
              <div className="section-progress-bar">
                <div className="section-progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
