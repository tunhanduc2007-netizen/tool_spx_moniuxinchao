# Tool SPX

Công cụ tự động hóa, tra cứu vận đơn và xử lý dữ liệu SPX Express.

---

## 🛠 Yêu cầu & Công nghệ
- **Python**: >= 3.12 (quản lý tự động qua `uv`)
- **Package Manager**: [uv](https://github.com/astral-sh/uv) (siêu tốc, tự tạo môi trường ảo `.venv`)
- **Thư viện chính**:
  - `requests`: Gọi API mạng
  - `pandas`, `openpyxl`: Đọc, xuất và xử lý file Excel
  - `rich`: Giao diện dòng lệnh (CLI) trực quan
  - `python-dotenv`: Đọc biến môi trường từ file `.env`

---

## 🚀 Hướng dẫn sử dụng nhanh

### 1. Chạy dự án
```bash
uv run tool-spx
```
*(Hoặc `uv run python src/tool_spx/__init__.py`)*

### 2. Cài thêm thư viện mới (ví dụ Playwright, BeautifulSoup4...)
```bash
uv add playwright
uv add beautifulsoup4
```

### 3. Cấu hình biến môi trường
Tạo file `.env` từ file mẫu:
```bash
cp .env.example .env
```

---

## 🌿 Quản lý Git & Đẩy code lên GitHub

### 1. Kiểm tra trạng thái
```bash
git st         # Viết tắt của git status
```

### 2. Commit thay đổi
```bash
git add .
git commit -m "Tính năng mới"
```

### 3. Đẩy lên GitHub lần đầu (Dùng GitHub CLI)
Chỉ cần chạy 1 lệnh để tạo repo trên GitHub và đẩy code lên:
```bash
# Đăng nhập GitHub (chỉ cần làm 1 lần đầu)
gh auth login

# Tạo repo GitHub và push luôn
gh repo create tool_spx --public --source=. --remote=origin --push
```
