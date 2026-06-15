/** Client-side sentence check (used on GitHub Pages without Express API). */
export function basicSentenceCheck(word, sentence, example = '') {
  const trimmed = sentence.trim()
  const hasWord = trimmed.includes(word)
  const hasChinese = /[\u4e00-\u9fff]/.test(trimmed)
  const endsProperly = /[。！？.!?]$/.test(trimmed)

  if (!hasChinese) {
    return {
      correct: false,
      feedback: 'Câu cần viết bằng tiếng Trung.',
      suggestions: `Hãy viết một câu tiếng Trung có chứa từ "${word}". Ví dụ: ${example}`,
    }
  }
  if (!hasWord) {
    return {
      correct: false,
      feedback: `Câu chưa sử dụng từ "${word}".`,
      suggestions: `Hãy đưa từ "${word}" vào câu. Ví dụ: ${example}`,
    }
  }
  if (!endsProperly) {
    return {
      correct: false,
      feedback: 'Câu nên kết thúc bằng dấu câu (。！？).',
      suggestions: example,
    }
  }
  return {
    correct: true,
    feedback:
      'Câu của bạn đúng cấu trúc cơ bản và có sử dụng từ vựng. (Kiểm tra offline trên GitHub Pages — không có AI.)',
    suggestions: '',
  }
}
