import { Router } from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multer.js';
import QRModel from '../models/qrModel.js';
import { uploadFileOnCloudinary } from '../utils/cloudinary.js';
import { generateQRCode } from '../controllers/qrcodeController.js';
import fs from 'fs/promises';
import FileModel from '../models/fileModel.js'; // Added missing import

const router = Router();

// File Upload Route
router.post('/upload', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
        console.log('Request reached file upload route');
        console.log('User:', req.user?._id);
        
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
            fileId: newFile._id,
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

// QR Code Fetch Route
router.get('/qrcode/:fileId', isAuthenticated, async (req, res) => {
    try {
        const { fileId } = req.params;
        const userId = req.user._id; // Get user ID from auth middleware

        // First verify if the file belongs to the user
        const file = await FileModel.findOne({ 
            _id: fileId,
            user: userId 
        });
        
        if (!file) {
            return res.status(404).send({ 
                success: false, 
                message: 'File not found or unauthorized' 
            });
        }

        // Get the QR code for this specific file
        const qrCode = await QRModel.findOne({ fileId: file._id });
        if (!qrCode) {
            return res.status(404).send({
                success: false,
                message: 'QR code not found for this file'
            });
        }
        res.status(200).send({
            success: true,
            qrCode: qrCode.qrCode,
            fileName: file.filename,
            uploadDate: file.uploadDate
        });
    } catch (error) {
        console.error('QR Code fetch error:', error);
        res.status(500).send({
            success: false,
            message: 'Error fetching QR code',
            error: error.message
        });
    }
});

export default router;
