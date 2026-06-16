import { getSection } from '../utils/categories'

export default function Header({
  mode,
  onModeChange,
  wordCount,
  sectionId,
  onBack,
}) {
  const section = sectionId ? getSection(sectionId) : null

  const modes = [
    { id: 'review', label: 'Ôn tập', icon: '📚' },
    { id: 'test', label: 'Kiểm tra', icon: '✏️' },
    { id: 'write', label: 'Viết câu', icon: '✍️' },
  ]

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="logo">
          {section && (
            <button type="button" className="back-btn" onClick={onBack} aria-label="Về trang chủ">
              ←
            </button>
          )}
          <span className="logo-icon">中</span>
          <div>
            <h1>
              {section ? (
                <>
                  <span className="section-badge">{section.icon}</span>
                  {section.label}
                </>
              ) : (
                'Học Từ Vựng Tiếng Trung'
              )}
            </h1>
            <p className="subtitle">
              {section
                ? `${section.chinese} · ${wordCount} từ · HSK · Tiếng Việt`
                : `${wordCount} từ · HSK · Tiếng Việt`}
            </p>
          </div>
        </div>
      </div>
      {section && (
        <nav className="mode-nav">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`mode-btn ${mode === m.id ? 'active' : ''}`}
              onClick={() => onModeChange(m.id)}
            >
              <span className="mode-icon">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}
