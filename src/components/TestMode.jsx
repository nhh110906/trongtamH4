import { useState, useEffect, useCallback } from 'react';
import { shuffleArray } from '../hooks/useVocabulary';

function pickOptions(vocabulary, correct, count = 4) {
  const others = vocabulary.filter((v) => v.id !== correct.id);
  const shuffled = shuffleArray(others);
  const options = [correct, ...shuffled.slice(0, count - 1)];
  return shuffleArray(options);
}

export default function TestMode({ vocabulary, categories }) {
  const [category, setCategory] = useState('all');
  const [mode, setMode] = useState('choice');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const startQuiz = useCallback(() => {
    let pool = vocabulary;
    if (category !== 'all') pool = pool.filter((v) => v.category === category);
    const quiz = shuffleArray(pool).slice(0, Math.min(10, pool.length));
    setQuestions(quiz);
    setCurrent(0);
    setScore(0);
    setAnswered(false);
    setSelected(null);
    setTypedAnswer('');
    setFeedback(null);
    setFinished(false);
  }, [vocabulary, category]);

  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  const question = questions[current];
  const options = question ? pickOptions(vocabulary, question) : [];

  const checkAnswer = (answer) => {
    if (answered || !question) return;
    const isCorrect =
      mode === 'choice'
        ? answer.id === question.id
        : answer.trim().toLowerCase() === question.vietnamese.split('/')[0].trim().toLowerCase() ||
          question.vietnamese.toLowerCase().includes(answer.trim().toLowerCase());

    setAnswered(true);
    setSelected(answer);
    if (isCorrect) setScore((s) => s + 1);
    setFeedback(isCorrect ? 'Chính xác! 🎉' : `Sai rồi. Đáp án: ${question.vietnamese}`);
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setAnswered(false);
      setSelected(null);
      setTypedAnswer('');
      setFeedback(null);
    }
  };

  if (!question && !finished) {
    return (
      <div className="panel empty-state">
        <p>Không đủ từ vựng để kiểm tra.</p>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="panel result-panel">
        <h2>Kết quả kiểm tra</h2>
        <div className="score-circle">
          <span className="score-num">{score}/{questions.length}</span>
          <span className="score-pct">{pct}%</span>
        </div>
        <p className="result-msg">
          {pct >= 80 ? 'Xuất sắc! Bạn đã nắm vững từ vựng.' : pct >= 60 ? 'Khá tốt! Hãy ôn thêm nhé.' : 'Cần ôn tập thêm. Cố lên!'}
        </p>
        <button type="button" className="btn btn-primary" onClick={startQuiz}>
          Làm lại
        </button>
      </div>
    );
  }

  return (
    <div className="test-mode">
      <div className="toolbar">
        <label>
          Loại từ
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">Tất cả</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Kiểu câu hỏi
          <select value={mode} onChange={(e) => { setMode(e.target.value); startQuiz(); }}>
            <option value="choice">Trắc nghiệm</option>
            <option value="type">Gõ nghĩa tiếng Việt</option>
          </select>
        </label>
        <div className="quiz-progress">
          Câu {current + 1}/{questions.length} · Điểm: {score}
        </div>
      </div>

      <div className="quiz-card">
        <span className="card-category">{question.category}</span>
        <h2 className="quiz-word">{question.word}</h2>
        <p className="card-pinyin">{question.pinyin}</p>
        <p className="quiz-prompt">Nghĩa tiếng Việt là gì?</p>

        {mode === 'choice' ? (
          <div className="options-grid">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`option-btn ${
                  answered
                    ? opt.id === question.id
                      ? 'correct'
                      : selected?.id === opt.id
                        ? 'wrong'
                        : ''
                    : ''
                }`}
                onClick={() => checkAnswer(opt)}
                disabled={answered}
              >
                {opt.vietnamese}
              </button>
            ))}
          </div>
        ) : (
          <div className="type-answer">
            <input
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder="Nhập nghĩa tiếng Việt..."
              disabled={answered}
              onKeyDown={(e) => e.key === 'Enter' && !answered && checkAnswer(typedAnswer)}
            />
            {!answered && (
              <button type="button" className="btn btn-primary" onClick={() => checkAnswer(typedAnswer)}>
                Kiểm tra
              </button>
            )}
          </div>
        )}

        {feedback && (
          <div className={`feedback ${feedback.startsWith('Chính') ? 'feedback-ok' : 'feedback-err'}`}>
            {feedback}
            {!feedback.startsWith('Chính') && question.example && (
              <p className="example-hint">VD: {question.example}</p>
            )}
          </div>
        )}

        {answered && (
          <button type="button" className="btn btn-primary next-btn" onClick={nextQuestion}>
            {current + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp theo →'}
          </button>
        )}
      </div>
    </div>
  );
}
