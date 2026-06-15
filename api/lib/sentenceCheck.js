export async function checkWithOpenAI(word, sentence, example) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.CURSOR_API_KEY
  if (!apiKey) {
    throw new Error('Chưa cấu hình OPENAI_API_KEY hoặc CURSOR_API_KEY')
  }

  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  const prompt = `Bạn là giáo viên tiếng Trung. Học viên viết câu ví dụ dùng từ "${word}".
Câu mẫu tham khảo: ${example}
Câu học viên viết: ${sentence}

Đánh giá câu của học viên. Trả lời JSON với format:
{"correct": true/false, "feedback": "nhận xét bằng tiếng Việt", "suggestions": "gợi ý cải thiện bằng tiếng Việt hoặc chuỗi rỗng"}
Chỉ trả JSON, không markdown.`

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`API error: ${response.status} ${err}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || '{}'
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  return JSON.parse(jsonMatch ? jsonMatch[0] : content)
}

export function basicCheck(word, sentence, example) {
  const hasWord = sentence.includes(word)
  const hasChinese = /[\u4e00-\u9fff]/.test(sentence)
  const endsProperly = /[。！？.!?]$/.test(sentence.trim())

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
    feedback: 'Câu của bạn đúng cấu trúc cơ bản và có sử dụng từ vựng. (Chế độ offline — chưa có API key)',
    suggestions: '',
  }
}

export async function evaluateSentence(word, sentence, example = '') {
  const apiKey = process.env.OPENAI_API_KEY || process.env.CURSOR_API_KEY
  if (apiKey) {
    return checkWithOpenAI(word, sentence, example)
  }
  return basicCheck(word, sentence, example)
}
