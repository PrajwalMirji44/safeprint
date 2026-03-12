
# SafePrint 🖨️🔐

SafePrint is a privacy-first web application for securely transferring documents to be printed — without exposing personal contact info like email or WhatsApp. 

## 🔐 Features
- AES-256-CBC encryption for file privacy
- Secure download via unique codes or QR codes
- Automatic file deletion after download
- No storage of personal user data

## 🧠 Tech Stack
- **Frontend**: React.js + TailwindCSS
- **Backend**: Node.js + Express
- **File Encryption**: crypto (AES-256-CBC)
- **QR Code**: `qrcode.react`, `react-qr-reader`

## 🚀 How It Works
1. Upload a file (auto-encrypted)
2. Get a unique code + QR
3. Receiver scans or enters the code
4. File is decrypted and sent to print
5. File gets auto-deleted after download

---

Made with ❤️ by Pavan
