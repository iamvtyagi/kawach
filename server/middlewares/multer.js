import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from 'cloudinary';
import crypto from "crypto";

// Configure Cloudinary storage   - multer-storage-cloudinary handles uploading to cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads",
        allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
        public_id: (req, file) => {
            return `${crypto.randomBytes(12).toString('hex')}_${file.originalname}`;
        }
    }
});

// Initialize upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

export default upload;