export default function Header({ mode, onModeChange, wordCount }) {
  const modes = [
    { id: 'review', label: 'Ôn tập', icon: '📚' },
    { id: 'test', label: 'Kiểm tra', icon: '✏️' },
    { id: 'write', label: 'Viết câu', icon: '✍️' },
  ]

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="logo">
          <span className="logo-icon">中</span>
          <div>
            <h1>Học Từ Vựng Tiếng Trung</h1>
            <p className="subtitle">{wordCount} từ · HSK · Tiếng Việt</p>
          </div>
        </div>
      </div>
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
    </header>
  )
}
