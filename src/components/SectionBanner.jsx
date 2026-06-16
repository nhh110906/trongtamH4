import { getSection } from '../utils/categories'

export default function SectionBanner({ sectionId, wordCount }) {
  const section = getSection(sectionId)
  if (!section) return null

  return (
    <div className="section-banner" style={{ '--section-color': section.color }}>
      <span className="section-banner-icon">{section.icon}</span>
      <div>
        <p className="section-banner-title">{section.label}</p>
        <p className="section-banner-sub">{section.chinese} · {wordCount} từ trong phần này</p>
      </div>
    </div>
  )
}
