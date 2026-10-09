import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import os from 'os';
import { uploadImage } from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Setup local disk storage temporarily before sending to Cloudinary
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir()); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Protect upload route
router.post('/image', authenticate, upload.single('image'), uploadImage);

export default router;
