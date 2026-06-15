const CATEGORIES = ['Tất cả', '名词', '动词', '形容词', '副词', '连词']

const LABELS = {
  'Tất cả': 'Tất cả',
  '名词': 'Danh từ',
  '动词': 'Động từ',
  '形容词': 'Tính từ',
  '副词': 'Phó từ',
  '连词': 'Liên từ',
}

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="category-filter">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`filter-btn ${selected === cat ? 'active' : ''}`}
          onClick={() => onChange(cat)}
        >
          {LABELS[cat]}
        </button>
      ))}
    </div>
  )
}

export { CATEGORIES }
