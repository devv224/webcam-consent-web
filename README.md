# Dự án: Web xin phép chụp ảnh (1 server duy nhất)

## Cấu trúc project
```
webcam-consent-project/
├── server.js        <- server (vừa hiển thị web, vừa nhận ảnh)
├── package.json      <- danh sách thư viện cần cài
├── public/
│   └── index.html    <- trang web người dùng sẽ thấy
└── uploads/           <- ảnh nhận được sẽ tự lưu vào đây (tự tạo khi chạy)
```

## Cách hoạt động
1. Người dùng mở link → thấy trang hỏi "Bạn có chấp thuận không?"
2. Bấm **Không đồng ý** → không có gì xảy ra.
3. Bấm **Tôi đồng ý** → trình duyệt hiện popup xin quyền camera (bắt buộc của trình duyệt, không thể ẩn) → sau khi họ bấm "Cho phép", trang tự động chụp và gửi ảnh về server.
4. Server nhận ảnh, lưu vào thư mục `uploads/`.

## Chạy thử trên máy bạn
```bash
npm install
npm start
```
Mở trình duyệt vào `http://localhost:3000`.

## Đưa lên mạng để gửi link cho người khác (deploy lên Render — miễn phí)

1. Tạo tài khoản tại **github.com**, tạo 1 repo mới (ví dụ `webcam-consent-web`), rồi upload cả 3 thứ: `server.js`, `package.json`, và thư mục `public/` (chứa `index.html`) lên đó — dùng nút "Add file" → "Upload files" trên web GitHub, kéo thả cả folder vào.
2. Vào **render.com**, đăng ký (đăng nhập bằng GitHub cho tiện, không cần thẻ tín dụng).
3. Bấm **New** → **Web Service** → chọn repo bạn vừa tạo.
4. Cấu hình: Build Command = `npm install`, Start Command = `npm start`, chọn gói **Free**.
5. Bấm **Create Web Service**, đợi 2-3 phút. Render tự cấp cho bạn 1 link dạng `https://ten-app-xxxx.onrender.com`.
6. **Xong — gửi trực tiếp link đó cho người khác.** Họ mở link, bấm đồng ý, ảnh tự động gửi về `uploads/` trên server.

> Không cần Netlify hay bất kỳ nơi nào khác nữa — vì trang web và nơi nhận ảnh giờ nằm chung 1 chỗ.

## Xem ảnh đã nhận được
- Nếu chạy trên Render (gói Free): vào tab **Shell** trong Render dashboard, gõ `ls uploads/` để xem danh sách, hoặc thêm 1 đoạn code để tải ảnh xuống (nói mình biết nếu cần).
- **Lưu ý**: gói Free của Render sẽ xoá dữ liệu ổ đĩa mỗi khi server khởi động lại. Nếu cần lưu ảnh lâu dài, nên nối thêm cloud storage (Cloudinary, AWS S3...) — nói mình biết nếu bạn muốn thêm phần này.

## Về mặt pháp lý / đạo đức
- Khi gửi cho người thật, nên nói rõ mục đích thu thập ảnh (khảo sát, xác thực, chấm công...).
- Có chính sách bảo mật nêu rõ cách lưu trữ, thời gian giữ, ai được truy cập.
- Cho phép người dùng yêu cầu xóa ảnh của họ khi cần.
