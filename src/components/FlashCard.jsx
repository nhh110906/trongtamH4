export default function FlashCard({ word, flipped, onFlip }) {
  return (
    <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={onFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <span className="card-category">{word.category}</span>
          <h2 className="card-word">{word.word}</h2>
          <p className="card-pinyin">{word.pinyin}</p>
          <p className="card-hint">Nhấn để lật thẻ</p>
        </div>
        <div className="flashcard-back">
          <span className="card-category">{word.category}</span>
          <h3 className="card-vietnamese">{word.vietnamese}</h3>
          <div className="card-example">
            <p className="example-cn">{word.example}</p>
            <p className="example-py">{word.examplePinyin}</p>
            <p className="example-vi">{word.exampleVietnamese}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
