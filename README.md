# Học Từ Vựng Tiếng Trung — TrongtamH4

Ứng dụng flashcard web học từ vựng tiếng Trung (HSK) với giao diện tiếng Việt.

## Dùng app (không cần cài đặt)

Mở trực tiếp trên trình duyệt — **không cần clone repo hay chạy `npm`**:

**[https://nhh110906.github.io/trongtamH4/](https://nhh110906.github.io/trongtamH4/)**

Mọi thay đổi trên nhánh `main` được deploy tự động qua GitHub Actions.

## Tính năng

- **Ôn tập (Review):** Lật thẻ flashcard, lọc theo danh mục (danh từ, động từ, tính từ, phó từ, liên từ), theo dõi tiến độ
- **Kiểm tra (Test):** Trắc nghiệm chọn nghĩa tiếng Việt, chấm điểm
- **Viết câu (Writing):** Viết câu ví dụ; trên GitHub Pages dùng **kiểm tra cơ bản offline** (từ trong câu, tiếng Trung, dấu câu)

## Từ vựng

- **352 từ** từ PDF HSK (danh từ, động từ, tính từ, phó từ, liên từ)
- Bao gồm đủ **105 danh từ** bắt buộc từ đề bài
- Mỗi từ có: chữ Hán, pinyin, nghĩa tiếng Việt, câu ví dụ + pinyin + dịch

## GitHub Pages & deploy

- Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
- Build: `npm run build:pages` (base path `/trongtamH4/`)
- Pages được bật với nguồn **GitHub Actions** (không upload thư mục `dist` thủ công)

## Chạy local (tùy chọn — cho AI kiểm tra câu)

Chỉ cần khi bạn muốn **đánh giá câu bằng AI** (OpenAI) qua Express API. Bản public trên Pages không chạy backend.

```bash
git clone https://github.com/nhh110906/trongtamH4.git
cd trongtamH4
npm install
cp .env.example .env   # OPENAI_API_KEY hoặc CURSOR_API_KEY
npm run dev
```

Mở **http://localhost:5173**

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Vite + Express API (AI kiểm tra câu nếu có key) |
| `npm run dev:client` | Chỉ frontend |
| `npm run build:pages` | Build cho GitHub Pages |
| `npm run generate:vocab` | Tạo lại `vocabulary.json` |

## Giới hạn trên GitHub Pages

GitHub Pages chỉ phục vụ file tĩnh — **không có Express/API**. Chế độ Viết câu trên URL public dùng kiểm tra offline, không gọi OpenAI. Review và Test hoạt động đầy đủ.

## Cấu trúc dự án

```
trongtamH4/
├── server/index.js          # API local (không dùng trên Pages)
├── src/utils/basicSentenceCheck.js
├── scripts/generate-vocabulary.js
├── src/data/vocabulary.json
└── src/components/          # Review, Test, Write
```

## Công nghệ

- React 19 + Vite 8
- Express 5 (chỉ khi dev local)
- pinyin-pro

## Tác giả

Nguyễn Huy Hoàng — CSE391
