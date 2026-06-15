# Học Từ Vựng Tiếng Trung — TrongtamH4

Ứng dụng flashcard web học từ vựng tiếng Trung (HSK) với giao diện tiếng Việt.

**Demo:** [https://nhh110906.github.io/trongtamH4/](https://nhh110906.github.io/trongtamH4/)

## Tính năng

- **Ôn tập (Review):** Lật thẻ flashcard, lọc theo danh mục (danh từ, động từ, tính từ, phó từ, liên từ), theo dõi tiến độ
- **Kiểm tra (Test):** Trắc nghiệm chọn nghĩa tiếng Việt, chấm điểm
- **Viết câu (Writing):** Viết câu ví dụ, AI kiểm tra đúng/sai qua API

## Từ vựng

- **352 từ** từ PDF HSK (danh từ, động từ, tính từ, phó từ, liên từ)
- Bao gồm đủ **105 danh từ** bắt buộc từ đề bài
- Mỗi từ có: chữ Hán, pinyin, nghĩa tiếng Việt, câu ví dụ + pinyin + dịch

## Cài đặt & chạy local

```bash
# Clone repo
git clone https://github.com/nhh110906/trongtamH4.git
cd trongtamH4

# Cài dependencies
npm install

# Tạo file .env (tùy chọn — cho kiểm tra câu bằng AI)
cp .env.example .env
# Chỉnh OPENAI_API_KEY hoặc CURSOR_API_KEY trong .env

# Chạy dev (frontend + API server)
npm run dev
```

Mở trình duyệt: **http://localhost:5173**

### Scripts khác

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Chạy Vite + Express API |
| `npm run dev:client` | Chỉ frontend (không API) |
| `npm run build` | Build production |
| `npm run build:pages` | Build cho GitHub Pages |
| `npm run generate:vocab` | Tạo lại `vocabulary.json` từ PDF data |

## Cấu hình API key

Tạo file `.env` từ `.env.example`:

```env
OPENAI_API_KEY=sk-...
# hoặc
CURSOR_API_KEY=...

# Tùy chọn
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
PORT=3001
```

- **Có API key:** Chế độ Viết câu dùng AI đánh giá chi tiết bằng tiếng Việt
- **Không có API key:** Kiểm tra cơ bản offline (từ có trong câu, dấu câu, v.v.)

## Cấu trúc dự án

```
trongtamH4/
├── server/index.js          # API /api/check-sentence
├── scripts/
│   ├── wordData.js          # Dữ liệu từ vựng từ PDF
│   └── generate-vocabulary.js
├── src/
│   ├── data/vocabulary.json # 352 từ (generated)
│   ├── components/          # Review, Test, Write modes
│   └── App.jsx
└── .env.example
```

## Deploy GitHub Pages

```bash
npm run build:pages
# Push thư mục dist lên gh-pages hoặc dùng GitHub Actions
```

## Công nghệ

- React 19 + Vite 8
- Express 5 (API backend)
- pinyin-pro (phiên âm)
- OpenAI API (kiểm tra câu — tùy chọn)

## Tác giả

Nguyễn Huy Hoàng — CSE391
