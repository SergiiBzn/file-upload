import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
const port = 5432;

app.use('/files', express.static('uploads'));
app.use(cors());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_, file, cb) => {
    const ok = ['image/png', 'image/jpeg', 'image/webp'].includes(
      file.mimetype
    );
    cb(ok ? null : new Error('UNSUPPORTED_TYPE'), ok);
  },
});

app.post('/file-upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'NO FILE' });
  const location = `${req.protocol}://${req.get('host')}/files/${
    req.file.filename
  }`;
  res.status(req.file ? 200 : 400).json({ location });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'UPLOAD_FAILED' });
});

app.listen(port, () => {
  console.log(`Server läuft auf port ${port}`);
});
