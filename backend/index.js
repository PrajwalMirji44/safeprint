const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const os = require('os');
const ptp = require('pdf-to-printer');

const app = express();
const PORT = 5000;

app.use(cors({
  exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const encryptedName = crypto.randomBytes(8).toString('hex') + path.extname(file.originalname);
    cb(null, encryptedName);
  }
});

const upload = multer({ storage });

let fileStore = {}; // In-memory store: code => { filename, originalName }

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const code = crypto.randomBytes(4).toString('hex');
  fileStore[code] = {
    filename: file.filename,
    originalName: file.originalname
  };

  res.json({ code });
});

// Non-destructive preview fetch
app.get('/download/:code', (req, res) => {
  const code = req.params.code;
  const fileData = fileStore[code];

  if (fileData && fileData.filename) {
    const filename = fileData.filename;
    const originalName = fileData.originalName;
    const filepath = path.join(__dirname, 'uploads', filename);
    res.download(filepath, originalName);
  } else {
    res.status(404).json({ message: 'Invalid code' });
  }
});

// Direct Print — PDF never sent to browser
app.post('/print/:code', async (req, res) => {
  const code = req.params.code;
  const fileData = fileStore[code];

  if (!fileData) {
    return res.status(404).json({ error: 'Invalid code. File may have already been printed or deleted.' });
  }

  const filepath = path.join(__dirname, 'uploads', fileData.filename);

  if (!fs.existsSync(filepath)) {
    delete fileStore[code];
    return res.status(404).json({ error: 'File not found on server.' });
  }

  // Copy to temp file (no encryption in this route — file already stored as-is)
  const ext = path.extname(fileData.originalName) || '.pdf';
  const tmpFile = path.join(os.tmpdir(), `safeprint_${code}${ext}`);
  fs.copyFileSync(filepath, tmpFile);

  try {
    const printers = await ptp.getPrinters();
    if (!printers || printers.length === 0) {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
      return res.status(503).json({ error: 'No printer connected. Please connect a printer and try again.' });
    }

    await ptp.print(tmpFile);

    // DELETE original and record ONLY on success
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    delete fileStore[code];

    return res.json({ success: true, message: 'Document sent to printer successfully and deleted.' });
  } catch (err) {
    console.error('Print error:', err);
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    return res.status(503).json({ error: 'Failed to send to printer. Make sure a printer is connected and set as default.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
