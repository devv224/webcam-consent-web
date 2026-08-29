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
