import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user._id}-${uniqueSuffix}${ext}`);
  }
});

// File filter — only images
const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Upload single image
export const uploadImage = [
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl, filename: req.file.filename });
  }
];

// Upload multiple images (for projects)
export const uploadImages = [
  upload.array('images', 5),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const images = req.files.map(f => ({
      url: `/uploads/${f.filename}`,
      filename: f.filename
    }));
    res.json(images);
  }
];

// Delete an uploaded file
export const deleteFile = (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ message: 'Filename is required' });
    }

    const filePath = path.join(uploadDir, filename);

    // Security: ensure the path stays within uploads directory
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadDir = path.resolve(uploadDir);
    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      return res.status(403).json({ message: 'Invalid file path' });
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted' });
    } else {
      res.json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete file' });
  }
};