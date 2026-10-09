import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Setup using env vars
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    // Since we are using multer with disk storage temporarily
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'propex/properties',
      use_filename: true,
      unique_filename: true,
    });

    // Clean up local temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ 
      status: 'success', 
      data: {
        url: result.secure_url,
        public_id: result.public_id
      } 
    });
  } catch (error: any) {
    // Attempt cleanup if error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
};
