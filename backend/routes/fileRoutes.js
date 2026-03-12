const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');
const mime = require('mime-types');
const ptp = require('pdf-to-printer');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// In-memory store for file metadata
const fileStore = {}; // code -> { diskFilename, originalName, key, iv }

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload & Encrypt File
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const code = crypto.randomBytes(4).toString('hex');
  const diskFilename = `${code}-${crypto.randomBytes(8).toString('hex')}${path.extname(req.file.originalname)}`;
  const filepath = path.join(uploadDir, diskFilename);

  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(req.file.buffer), cipher.final()]);

  fs.writeFileSync(filepath, encrypted);

  // Store metadata in memory instead of separate .key file
  fileStore[code] = {
    diskFilename,
    originalName: req.file.originalname,
    key: key.toString('hex'),
    iv: iv.toString('hex'),
  };

  res.json({ code });
});

// Stream & Decrypt File for Viewing
router.get('/download/:code', (req, res) => {
  const code = req.params.code;
  const fileData = fileStore[code];

  if (!fileData) {
    return res.status(404).json({ error: 'Invalid code. File may have been downloaded already.' });
  }

  const filepath = path.join(uploadDir, fileData.diskFilename);

  if (!fs.existsSync(filepath)) {
    delete fileStore[code];
    return res.status(404).json({ error: 'File not found on server. It may have been downloaded already.' });
  }

  const mimeType = mime.lookup(fileData.originalName) || 'application/octet-stream';
  console.log(`Attempting to stream file '${fileData.originalName}' with MIME type '${mimeType}'`);

  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(fileData.key, 'hex'), Buffer.from(fileData.iv, 'hex'));

  // IMPORTANT: If the browser does not have a viewer for the `mimeType`,
  // it will fall back to downloading the file, even with "Content-Disposition: inline".
  // A type of `application/octet-stream` will almost always trigger a download.
  res.set({
    'Content-Type': mimeType,
    'Content-Disposition': `inline; filename="${fileData.originalName}"`,
    'Cache-Control': 'no-store, no-cache, must-revalidate, private'
  });

  const readStream = fs.createReadStream(filepath);

  // Add error handling to prevent crashes and leaving dangling files.
  readStream.on('error', (err) => {
    console.error('File read stream error:', err);
    if (!res.headersSent) {
      res.status(500).send('Error reading file from server.');
    }
  });

  decipher.on('error', (err) => {
    console.error('Decryption stream error:', err);
    if (!res.headersSent) {
      res.status(500).send('Error decrypting file. It may be corrupt.');
    }
  });

  readStream.pipe(decipher).pipe(res);
});


// Direct Print — PDF never sent to browser
router.post('/print/:code', async (req, res) => {
  const code = req.params.code;
  const fileData = fileStore[code];

  if (!fileData) {
    return res.status(404).json({ error: 'Invalid code. File may have already been printed or deleted.' });
  }

  const filepath = path.join(uploadDir, fileData.diskFilename);

  if (!fs.existsSync(filepath)) {
    delete fileStore[code];
    return res.status(404).json({ error: 'File not found on server.' });
  }

  // Decrypt in memory
  const encrypted = fs.readFileSync(filepath);
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(fileData.key, 'hex'),
    Buffer.from(fileData.iv, 'hex')
  );
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  // Write to a temp file so pdf-to-printer can access it
  const ext = path.extname(fileData.originalName) || '.pdf';
  const tmpFile = path.join(os.tmpdir(), `safeprint_${code}${ext}`);
  fs.writeFileSync(tmpFile, decrypted);

  try {
    // Check if any printers are available
    const printers = await ptp.getPrinters();
    if (!printers || printers.length === 0) {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
      return res.status(503).json({ error: 'No printer connected. Please connect a printer and try again.' });
    }

    // Send to default printer
    await ptp.print(tmpFile);

    // DELETE original and record ONLY on success/handoff
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    delete fileStore[code];

    return res.json({ success: true, message: 'Document sent to printer successfully and deleted from server.' });
  } catch (err) {
    console.error('Print error:', err);
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    return res.status(503).json({ error: 'Failed to send to printer. Make sure a printer is connected and set as default.' });
  }
});

module.exports = router;
