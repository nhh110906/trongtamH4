# Học Từ Vựng Tiếng Trung — TrongtamH4

Ứng dụng flashcard web học từ vựng tiếng Trung (HSK) với giao diện tiếng Việt.

## Dùng app (không cần cài đặt)

Mở trực tiếp trên trình duyệt — **không cần clone repo hay chạy `npm`**:

**[https://nhh110906.github.io/trongtamH4/](https://nhh110906.github.io/trongtamH4/)**

Dùng được trên **mọi thiết bị** (điện thoại, máy tính khác) qua URL trên.

Mọi thay đổi trên nhánh `main` được deploy tự động qua GitHub Actions.

## Tính năng

- **Ôn tập (Review):** Lật thẻ flashcard, lọc theo danh mục (danh từ, động từ, tính từ, phó từ, liên từ), theo dõi tiến độ
- **Kiểm tra (Test):** Trắc nghiệm chọn nghĩa tiếng Việt, chấm điểm
- **Viết câu (Writing):** Viết câu ví dụ; **đánh giá AI** khi đã cấu hình API serverless (xem bên dưới)

## Từ vựng

- **352 từ** từ PDF HSK (danh từ, động từ, tính từ, phó từ, liên từ)
- Bao gồm đủ **105 danh từ** bắt buộc từ đề bài
- Mỗi từ có: chữ Hán, pinyin, nghĩa tiếng Việt, câu ví dụ + pinyin + dịch

## Kiểm tra câu bằng AI trên mọi thiết bị

GitHub Pages **chỉ phục vụ file tĩnh** — không chạy được Express API. Để đánh giá câu bằng AI khi mở app từ điện thoại hoặc máy khác, dùng **API serverless trên Vercel** (miễn phí, deploy qua git).

### Kiến trúc

| Thành phần | URL | Vai trò |
|------------|-----|---------|
| Frontend | `https://nhh110906.github.io/trongtamH4/` | Giao diện flashcard |
| API AI | `https://<tên-project>.vercel.app/api/check-sentence` | Kiểm tra câu bằng OpenAI |

### Cài đặt một lần (khoảng 5 phút)

#### Bước 1 — Deploy API lên Vercel

1. Đăng nhập [vercel.com](https://vercel.com) bằng tài khoản GitHub
2. **Add New → Project** → chọn repo `nhh110906/trongtamH4`
3. Vercel tự nhận thư mục `api/` là serverless functions — **không cần đổi Build Command**
4. Vào **Settings → Environment Variables**, thêm:
   - `OPENAI_API_KEY` = API key OpenAI của bạn (hoặc `CURSOR_API_KEY`)
   - (Tùy chọn) `OPENAI_MODEL` = `gpt-4o-mini`
5. Bấm **Deploy**
6. Sau deploy, copy URL project, ví dụ: `https://trongtamh4.vercel.app`
7. Kiểm tra: mở `https://trongtamh4.vercel.app/api/health` — phải thấy `{"ok":true,"ai":true}`

#### Bước 2 — Nối frontend GitHub Pages với API

1. Vào repo GitHub → **Settings → Secrets and variables → Actions → Variables**
2. Thêm biến **`VITE_API_URL`** = URL Vercel (không có dấu `/` cuối), ví dụ:
   ```
   https://trongtamh4.vercel.app
   ```
3. Push lên `main` hoặc chạy lại workflow **Deploy to GitHub Pages**

Sau bước này, mọi người mở app trên **bất kỳ thiết bị nào** đều gọi API Vercel để kiểm tra câu bằng AI.

### Trả lời nhanh

| Câu hỏi | Trả lời |
|---------|---------|
| Dùng trên điện thoại / máy khác có API không? | **CÓ** — sau khi cấu hình Vercel + `VITE_API_URL` |
| Chỉ GitHub Pages, không Vercel? | **KHÔNG** — chỉ kiểm tra cơ bản offline |
| Cần chạy `npm run dev` trên máy mình? | **KHÔNG** — chỉ cần setup Vercel một lần |

## GitHub Pages & deploy

- Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
- Build: `npm run build:pages` (base path `/trongtamH4/`, nhúng `VITE_API_URL`)
- Pages được bật với nguồn **GitHub Actions**

## Chạy local (tùy chọn)

```bash
git clone https://github.com/nhh110906/trongtamH4.git
cd trongtamH4
npm install
cp .env.example .env   # OPENAI_API_KEY hoặc CURSOR_API_KEY
npm run dev
```

Mở **http://localhost:5173** — Vite proxy `/api` sang Express local.

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Vite + Express API (AI kiểm tra câu nếu có key) |
| `npm run dev:client` | Chỉ frontend |
| `npm run build:pages` | Build cho GitHub Pages |
| `npm run generate:vocab` | Tạo lại `vocabulary.json` |

## Cấu trúc dự án

```
trongtamH4/
├── api/                     # Serverless functions (Vercel)
│   ├── check-sentence.js
│   ├── health.js
│   └── lib/sentenceCheck.js
├── server/index.js          # API local (npm run dev)
├── src/utils/api.js         # URL API cho frontend
├── src/utils/basicSentenceCheck.js
├── scripts/generate-vocabulary.js
├── src/data/vocabulary.json
└── src/components/          # Review, Test, Write
```

## Công nghệ

- React 19 + Vite 8
- Express 5 (dev local) + Vercel Serverless (production API)
- pinyin-pro

## Tác giả

Nguyễn Huy Hoàng — CSE391
