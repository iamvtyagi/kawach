import { Router } from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multer.js';
import QRModel from '../models/qrModel.js';
import { generateQRCode } from '../controllers/qrcodeController.js';
import FileModel from '../models/fileModel.js'; // Added missing import

const router = Router();

// File Upload Route
router.post('/upload', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
        console.log('Request reached file upload route');
        console.log('User:', req.user?._id);
        
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "No file uploaded"
            });
        }

        // Create database entry with Cloudinary URL
        const newFile = new FileModel({
            filename: req.file.originalname,
            path: req.file.path, // Cloudinary URL
            mimetype: req.file.mimetype,
            size: req.file.size,
            user: req.user._id   // valid ha chill (user document ka id mil jayga )
        });

        await newFile.save();

        // Generate QR Code for the file URL
        const qrCode = await generateQRCode(newFile._id, req.file.path);

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

// Get Recent Uploads Route
router.get('/recent-uploads', isAuthenticated, async (req, res) => {
    try {
        const uploads = await FileModel.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('filename createdAt');

        const formattedUploads = uploads.map(upload => ({
            id: upload._id,
            name: upload.filename,
            date: new Date(upload.createdAt).toLocaleDateString(),
            status: 'Active'  // You can modify this based on your requirements
        }));

        res.status(200).json({
            success: true,
            uploads: formattedUploads
        });
    } catch (error) {
        console.error('Error fetching recent uploads:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recent uploads',
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


/*
Client Upload
     ↓
Express Route (/upload endpoint)
     ↓
upload.single('file') middleware
     ↓
CloudinaryStorage processes file
     ↓
File saved to Cloudinary
     ↓
Cloudinary response mapped to req.file
     ↓
Save to FileModel
*/