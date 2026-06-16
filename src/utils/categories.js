export const SECTIONS = [
  {
    id: '名词',
    label: 'Danh từ',
    chinese: '名词',
    icon: '📦',
    description: 'Học danh từ tiếng Trung — người, vật, sự việc',
    color: '#3b82f6',
  },
  {
    id: '动词',
    label: 'Động từ',
    chinese: '动词',
    icon: '⚡',
    description: 'Học động từ tiếng Trung — hành động, trạng thái',
    color: '#8b5cf6',
  },
  {
    id: '形容词',
    label: 'Tính từ / Hình dung từ',
    chinese: '形容词',
    icon: '🎨',
    description: 'Học tính từ — mô tả đặc điểm, tính chất',
    color: '#f59e0b',
  },
  {
    id: 'other',
    label: 'Khác',
    chinese: '副词 · 连词',
    categories: ['副词', '连词'],
    icon: '📝',
    description: 'Phó từ và liên từ — bổ sung ngữ pháp',
    color: '#10b981',
  },
]

export function getSection(sectionId) {
  return SECTIONS.find((s) => s.id === sectionId) ?? null
}

export function filterBySection(vocabulary, sectionId) {
  const section = getSection(sectionId)
  if (!section) return vocabulary
  if (section.categories) {
    return vocabulary.filter((v) => section.categories.includes(v.category))
  }
  return vocabulary.filter((v) => v.category === sectionId)
}

export function countBySection(vocabulary) {
  return SECTIONS.reduce((acc, section) => {
    acc[section.id] = filterBySection(vocabulary, section.id).length
    return acc
  }, {})
}
