import express from 'express';
import { uploadFile } from '../controllers/fileUploadcontroller.js';
import multer from 'multer';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: './public/images/upload' });

// Ensure the field name 'file' matches the input name in the form
router.post('/upload', isAuthenticated, upload.single('file'), (req, res, next) => {
    console.log('Uploaded file:', req.file); // Log the uploaded file
    if (Object.keys(req.body).length > 0) {
        console.log('Request body:', req.body); // Log the request body
    } else {
        console.log('Request body is empty');
    }
    next();
}, uploadFile);

export default router;
