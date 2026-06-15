import { useState } from 'react';
import { getCheckSentenceUrl } from '../utils/api';
import { basicSentenceCheck } from '../utils/basicSentenceCheck';

export default function WritingPractice({ vocabulary }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [sentence, setSentence] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const card = vocabulary[wordIndex % vocabulary.length];

  const randomWord = () => {
    setWordIndex(Math.floor(Math.random() * vocabulary.length));
    setSentence('');
    setResult(null);
  };

  const evaluate = async () => {
    if (!sentence.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(getCheckSentenceUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: card.word,
          sentence: sentence.trim(),
          example: card.example,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi kiểm tra');
      setResult(data);
    } catch {
      setResult(
        basicSentenceCheck(card.word, sentence.trim(), card.example || ''),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="writing-mode">
      <div className="writing-intro">
        <h2>Luyện viết câu ví dụ</h2>
        <p>Viết một câu tiếng Trung có sử dụng từ mục tiêu. AI sẽ đánh giá ngữ pháp và cách dùng từ.</p>
      </div>

      <div className="writing-card">
        <div className="target-word">
          <span className="card-category">{card.category}</span>
          <h2>{card.word}</h2>
          <p className="card-pinyin">{card.pinyin}</p>
          <p className="card-vietnamese">{card.vietnamese}</p>
          <p className="sample-example">Câu mẫu: {card.example}</p>
        </div>

        <div className="writing-input">
          <label htmlFor="user-sentence">Câu của bạn (tiếng Trung)</label>
          <textarea
            id="user-sentence"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder={`Viết câu có chứa "${card.word}"...`}
            rows={3}
          />
          <div className="writing-actions">
            <button type="button" className="btn btn-primary" onClick={evaluate} disabled={loading || !sentence.trim()}>
              {loading ? 'Đang kiểm tra...' : 'Gửi kiểm tra AI'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={randomWord}>
              Từ khác
            </button>
          </div>
        </div>

        {result && (
          <div className={`ai-result ${result.correct === true ? 'result-ok' : result.correct === false ? 'result-err' : 'result-neutral'}`}>
            <h3>
              {result.correct === true && '✓ Đúng rồi!'}
              {result.correct === false && '✗ Cần cải thiện'}
              {result.correct === null && 'ℹ Thông báo'}
            </h3>
            <p>{result.feedback}</p>
            {result.suggestions && (
              <div className="suggestions">
                <strong>Gợi ý:</strong> {result.suggestions}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
