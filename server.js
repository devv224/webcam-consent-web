// server.js
// Server duy nhất: vừa phục vụ trang web (public/index.html) vừa nhận ảnh gửi lên.
//
// Cài đặt:
//   npm install
// Chạy:
//   npm start

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000; // hosting như Render sẽ tự cấp PORT

// Phục vụ trang web tĩnh trong thư mục public/ (chứa index.html)
app.use(express.static(path.join(__dirname, "public")));

// Tạo thư mục lưu ảnh nếu chưa có
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Cấu hình multer để lưu file ảnh nhận được
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    cb(null, safeName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // giới hạn 10MB / ảnh
});

// Cho phép xem ảnh trực tiếp qua link, ví dụ: /uploads/ten-file.jpg
app.use("/uploads", express.static(UPLOAD_DIR));

// Trang xem tất cả ảnh đã nhận được (dạng thư viện ảnh đơn giản)
app.get("/gallery", (req, res) => {
  const files = fs.readdirSync(UPLOAD_DIR)
    .filter(f => f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png"))
    .sort()
    .reverse(); // ảnh mới nhất lên đầu

  const imagesHtml = files.map(f => `
    <div style="margin-bottom:24px;">
      <img src="/uploads/${f}" style="max-width:100%;border-radius:8px;" />
      <p style="color:#94a3b8;font-size:13px;">${f}</p>
    </div>
  `).join("");

  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Ảnh đã nhận</title>
      <style>
        body { font-family: system-ui, sans-serif; background:#0f172a; color:#e2e8f0; padding:20px; max-width:600px; margin:0 auto; }
        h1 { font-size:20px; }
      </style>
    </head>
    <body>
      <h1>Ảnh đã nhận (${files.length})</h1>
      ${files.length === 0 ? "<p>Chưa có ảnh nào.</p>" : imagesHtml}
    </body>
    </html>
  `);
});

// Endpoint nhận ảnh
app.post("/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: "Không có file ảnh nào được gửi lên." });
  }
  console.log(`[+] Nhận ảnh mới: ${req.file.filename} (${req.file.size} bytes) từ IP ${req.ip}`);
  res.json({ ok: true, filename: req.file.filename });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại cổng ${PORT}`);
  console.log(`Ảnh nhận được sẽ lưu tại: ${UPLOAD_DIR}`);
});
