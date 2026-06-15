# Flashcard Từ Vựng HSK4 — Trung Tâm H4

Ứng dụng web học từ vựng tiếng Trung HSK4 với giao diện tiếng Việt, gồm chế độ ôn tập, kiểm tra và luyện viết câu có AI chấm bài.

## Tính năng

- **Ôn tập (Review):** Thẻ flashcard lật 2 mặt (tiếng Trung ↔ tiếng Việt + câu ví dụ + pinyin)
- **Kiểm tra (Test):** Trắc nghiệm hoặc gõ nghĩa tiếng Việt, 10 câu mỗi lượt
- **Luyện viết:** Viết câu tiếng Trung, AI đánh giá ngữ pháp và cách dùng từ
- Lọc theo loại từ: 名词, 动词, 形容词, 副词, 连词
- Theo dõi tiến độ: Mới / Đang học / Đã thuộc
- Giao diện responsive, hỗ trợ mobile

## Nguồn dữ liệu

- PDF: `第一部分：名词、动词、形容词、副词、连词.pdf` — toàn bộ từ vựng 5 loại
- Ảnh HSK4: 105 danh từ (đã tích hợp trong PDF)

**Tổng số từ:** 353 mục từ vựng

## Yêu cầu

- Node.js 18 trở lên
- npm

## Cài đặt

```bash
cd /Users/hoang/Downloads/trongtamH4
npm install
```

## Chạy ứng dụng

```bash
npm run dev
```

Lệnh này khởi động đồng thời:
- Frontend Vite: http://localhost:5173
- API server: http://localhost:3001

Chỉ chạy frontend (không có AI chấm bài):

```bash
npm run dev:client
```

## Cấu hình API cho chấm câu (Luyện viết)

1. Sao chép file mẫu:

```bash
cp .env.example .env
```

2. Thêm API key vào `.env`:

```env
OPENAI_API_KEY=sk-your-openai-key
```

Hoặc dùng `CURSOR_API_KEY` nếu bạn có endpoint tương thích OpenAI Chat Completions.

3. Tùy chọn thêm:

```env
AI_API_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
PORT=3001
```

4. Khởi động lại `npm run dev`

> **Lưu ý:** Cursor SDK (`@cursor/sdk`) dùng để chạy agent trên codebase, không phù hợp cho chấm câu đơn giản. Ứng dụng dùng OpenAI-compatible Chat API — hỗ trợ OpenAI hoặc bất kỳ endpoint tương thích nào.

## Build production

```bash
npm run build
npm run preview
```

> Production cần deploy riêng API server (`server/index.js`) hoặc cấu hình proxy tới backend.

## Tái tạo dữ liệu từ vựng

```bash
npm run generate:vocab
```

## Cấu trúc thư mục

```
trongtamH4/
├── src/
│   ├── components/     # ReviewMode, TestMode, WritingPractice
│   ├── data/           # vocabulary.json (353 từ)
│   ├── hooks/          # useVocabulary
│   └── App.jsx
├── server/             # Express API chấm câu
├── scripts/            # generate-vocabulary.mjs
└── README.md
```

## Giấy phép

Dự án học tập — CSE391 / Trung tâm H4
