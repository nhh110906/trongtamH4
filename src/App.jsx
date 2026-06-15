import { useState } from 'react';
import { useVocabulary } from './hooks/useVocabulary';
import ReviewMode from './components/ReviewMode';
import TestMode from './components/TestMode';
import WritingPractice from './components/WritingPractice';
import './App.css';

const TABS = [
  { id: 'review', label: 'Ôn tập', icon: '📚' },
  { id: 'test', label: 'Kiểm tra', icon: '✏️' },
  { id: 'writing', label: 'Luyện viết', icon: '✍️' },
];

function App() {
  const [tab, setTab] = useState('review');
  const vocab = useVocabulary();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>
            <span className="logo">中</span>
            Flashcard HSK4
          </h1>
          <p className="subtitle">Học từ vựng tiếng Trung — Trung tâm H4</p>
        </div>
        <nav className="tab-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`tab-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-main">
        {tab === 'review' && <ReviewMode {...vocab} />}
        {tab === 'test' && <TestMode vocabulary={vocab.vocabulary} categories={vocab.categories} />}
        {tab === 'writing' && <WritingPractice vocabulary={vocab.vocabulary} />}
      </main>

      <footer className="app-footer">
        <p>{vocab.stats.total} từ vựng · Nguồn: PDF HSK4 + 105 danh từ</p>
      </footer>
    </div>
  );
}

export default App;
