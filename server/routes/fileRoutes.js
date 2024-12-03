import { Router } from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multer.js';
import FileModel from '../models/fileModel.js';
import { uploadFileOnCloudinary } from '../utils/cloudinary.js';
import { generateQRCode } from '../controllers/qrcodeController.js';
import fs from 'fs/promises';

const router = Router();

// File Upload Route
router.post('/upload', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
        // Upload to Cloudinary
        const cloudinaryResponse = await uploadFileOnCloudinary(req.file.path);

        // Create database entry
        const newFile = new FileModel({
            filename: req.file.filename,
            path: cloudinaryResponse.url,
            mimetype: req.file.mimetype,
            size: req.file.size,
            user: req.user._id   // valid ha chill (user document ka id mil jayga )
        });

        await newFile.save();

        // Clean up the local file after successful upload
        try {
            await fs.unlink(req.file.path);
            console.log('Local file cleaned up successfully');
        } catch (unlinkError) {
            console.error('Error cleaning up local file:', unlinkError);
            // Continue execution even if cleanup fails
        }


        // Generate QR Code and upload to cloudianry and save to database
        const qrCode = await generateQRCode(newFile._id, cloudinaryResponse.url);

        res.status(200).send({
            success: true,
            message: "File uploaded successfully",
            cloudinaryUrl: cloudinaryResponse.url,
            qrCode: qrCode  // qr code cloudinary url
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send({
            success: false,
            message: "Error uploading file",
            error: error.message
        });
    }
});

// File Fetch Route
router.get('/file/:id', async (req, res) => {
    try {
        const fileId = req.params.id;
        const file = await FileModel.findById(fileId);

        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        res.status(200).json({ success: true, file });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching file', error });
    }
});

export default router;
