import { useState } from 'react';

export default function ReviewMode({ vocabulary, categories, getStatus, markKnown, markLearning, stats }) {
  const [category, setCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);
  const [shuffled, setShuffled] = useState(false);
  const [deck, setDeck] = useState(vocabulary);

  const applyFilters = () => {
    let filtered = vocabulary;
    if (category !== 'all') filtered = filtered.filter((v) => v.category === category);
    if (statusFilter !== 'all') filtered = filtered.filter((v) => getStatus(v.id) === statusFilter);
    return filtered;
  };

  const currentDeck = shuffled ? deck : applyFilters();
  const card = currentDeck[index];
  const total = currentDeck.length;

  const goNext = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % total);
  };

  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + total) % total);
  };

  const handleShuffle = () => {
    const filtered = applyFilters();
    const newDeck = [...filtered].sort(() => Math.random() - 0.5);
    setDeck(newDeck);
    setShuffled(true);
    setIndex(0);
    setFlipped(false);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setShuffled(false);
    setIndex(0);
    setFlipped(false);
  };

  if (!card) {
    return (
      <div className="panel empty-state">
        <p>Không có từ vựng phù hợp với bộ lọc.</p>
      </div>
    );
  }

  const status = getStatus(card.id);

  return (
    <div className="review-mode">
      <div className="toolbar">
        <div className="filters">
          <label>
            Loại từ
            <select value={category} onChange={handleFilterChange(setCategory)}>
              <option value="all">Tất cả</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Tiến độ
            <select value={statusFilter} onChange={handleFilterChange(setStatusFilter)}>
              <option value="all">Tất cả</option>
              <option value="new">Mới</option>
              <option value="learning">Đang học</option>
              <option value="known">Đã thuộc</option>
            </select>
          </label>
          <label className="toggle-label">
            <input type="checkbox" checked={showPinyin} onChange={(e) => setShowPinyin(e.target.checked)} />
            Hiện pinyin
          </label>
        </div>
        <div className="stats-bar">
          <span>Tổng: {stats.total}</span>
          <span className="stat-known">Đã thuộc: {stats.known}</span>
          <span className="stat-learning">Đang học: {stats.learning}</span>
        </div>
      </div>

      <div className="card-area">
        <div
          className={`flashcard ${flipped ? 'flipped' : ''}`}
          onClick={() => setFlipped(!flipped)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setFlipped(!flipped)}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <span className="card-category">{card.category}</span>
              <span className={`card-status status-${status}`}>
                {status === 'known' ? '✓ Đã thuộc' : status === 'learning' ? '◎ Đang học' : '○ Mới'}
              </span>
              <h2 className="card-word">{card.word}</h2>
              {showPinyin && <p className="card-pinyin">{card.pinyin}</p>}
              <p className="flip-hint">Nhấn để lật thẻ</p>
            </div>
            <div className="flashcard-back">
              <h3 className="card-vietnamese">{card.vietnamese}</h3>
              {showPinyin && <p className="card-pinyin">{card.pinyin}</p>}
              <div className="example-block">
                <p className="example-cn">{card.example}</p>
                {showPinyin && <p className="example-py">{card.examplePinyin}</p>}
                <p className="example-vi">{card.exampleVietnamese}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-controls">
        <button type="button" className="btn btn-secondary" onClick={goPrev} disabled={total <= 1}>
          ← Trước
        </button>
        <span className="card-counter">{index + 1} / {total}</span>
        <button type="button" className="btn btn-secondary" onClick={goNext} disabled={total <= 1}>
          Sau →
        </button>
      </div>

      <div className="action-row">
        <button type="button" className="btn btn-learning" onClick={() => markLearning(card.id)}>
          Đang học
        </button>
        <button type="button" className="btn btn-known" onClick={() => markKnown(card.id)}>
          Đã thuộc
        </button>
        <button type="button" className="btn btn-shuffle" onClick={handleShuffle}>
          🔀 Trộn thẻ
        </button>
      </div>
    </div>
  );
}
