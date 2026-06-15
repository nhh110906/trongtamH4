import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

async function checkWithOpenAI(word, sentence, example) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.CURSOR_API_KEY
  if (!apiKey) {
    throw new Error('Chưa cấu hình OPENAI_API_KEY hoặc CURSOR_API_KEY trong file .env')
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

function basicCheck(word, sentence, example) {
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

app.post('/api/check-sentence', async (req, res) => {
  try {
    const { word, sentence, example } = req.body
    if (!word || !sentence) {
      return res.status(400).json({ error: 'Thiếu từ hoặc câu' })
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.CURSOR_API_KEY
    let result
    if (apiKey) {
      result = await checkWithOpenAI(word, sentence, example || '')
    } else {
      result = basicCheck(word, sentence, example || '')
    }

    res.json({
      correct: Boolean(result.correct),
      feedback: result.feedback || '',
      suggestions: result.suggestions || '',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
