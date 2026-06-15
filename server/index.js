import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function evaluateSentence({ word, pinyin, vietnamese, userSentence }) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.CURSOR_API_KEY;
  const baseUrl = process.env.AI_API_BASE_URL || 'https://api.openai.com/v1';

  if (!apiKey) {
    return {
      correct: null,
      feedback:
        'Chưa cấu hình API key. Vui lòng thêm OPENAI_API_KEY hoặc CURSOR_API_KEY vào file .env và khởi động lại server.',
      suggestions: 'Tạo file .env trong thư mục gốc dự án với nội dung: OPENAI_API_KEY=sk-...',
    };
  }

  const systemPrompt = `Bạn là giáo viên tiếng Trung chuyên đánh giá câu ví dụ của học viên Việt Nam.
Nhiệm vụ: kiểm tra câu tiếng Trung do học viên viết có đúng ngữ pháp, tự nhiên và sử dụng đúng từ mục tiêu không.
Luôn trả lời bằng tiếng Việt.
Trả về JSON hợp lệ với format:
{"correct": boolean, "feedback": "nhận xét chi tiết", "suggestions": "gợi ý cải thiện hoặc câu mẫu tốt hơn"}`;

  const userPrompt = `Từ mục tiêu: ${word} (${pinyin}) - nghĩa: ${vietnamese}
Câu học viên viết: ${userSentence}

Hãy đánh giá câu trên.`;

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    return {
      correct: Boolean(parsed.correct),
      feedback: parsed.feedback || 'Không có phản hồi.',
      suggestions: parsed.suggestions || '',
    };
  } catch (error) {
    console.error('AI evaluation error:', error.message);
    return {
      correct: null,
      feedback: `Lỗi khi gọi API: ${error.message}`,
      suggestions:
        'Kiểm tra API key trong file .env. Hỗ trợ OPENAI_API_KEY hoặc CURSOR_API_KEY với endpoint OpenAI-compatible.',
    };
  }
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    hasApiKey: Boolean(process.env.OPENAI_API_KEY || process.env.CURSOR_API_KEY),
  });
});

app.post('/api/evaluate', async (req, res) => {
  const { word, pinyin, vietnamese, userSentence } = req.body;

  if (!word || !userSentence?.trim()) {
    return res.status(400).json({
      correct: false,
      feedback: 'Vui lòng nhập câu tiếng Trung có chứa từ mục tiêu.',
      suggestions: '',
    });
  }

  const result = await evaluateSentence({ word, pinyin, vietnamese, userSentence: userSentence.trim() });
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
