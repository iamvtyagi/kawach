import { Router } from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multer.js';
import QRModel from '../models/qrModel.js';
import { generateQRCode } from '../controllers/qrcodeController.js';
import FileModel from '../models/fileModel.js';
import {  deleteFileFromCloudinary } from '../utils/cloudinary.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// File Upload Route
router.post('/upload', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
        console.log('Request reached file upload route');
        // This line logs the ID of the currently authenticated user to the console, 
        // using optional chaining (?.) to avoid errors if req.user is null or undefined.
        console.log('User ID:', req.user?._id);
        
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "No file uploaded"
            });
        }

        // Create database entry with Cloudinary URL and public ID
        const newFile = new FileModel({
            filename: req.file.originalname,
            path: req.file.path, // Cloudinary URL from multer-storage-cloudinary
            mimetype: req.file.mimetype,
            size: req.file.size,
            user: req.user._id,
            PublicId: req.file.filename // Public ID from multer-storage-cloudinary
        });

        await newFile.save();

        // Generate QR Code for the file URL
        const qrCode = await generateQRCode(newFile._id, `${process.env.FRONTEND_URL}/print/${newFile._id}`);

        res.status(200).send({
            success: true,
            message: "File uploaded successfully",
            fileId: newFile._id,
            fileUrl: req.file.path
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

// Delete File Route
router.delete('/delete/:fileId', isAuthenticated, async (req, res) => {
    try {
        console.log("Delete request received for fileId:", req.params.fileId);
        const { fileId } = req.params;
        const userId = req.user._id;

        // Find the file and verify ownership
        const file = await FileModel.findOne({ 
            _id: fileId,
            user: userId 
        });

        if (!file) {
            console.log("File not found or unauthorized");
            return res.status(404).send({
                success: false,
                message: 'File not found or unauthorized'
            });
        }

        console.log("Found file:", file);

        // Delete from Cloudinary using publicid
        if (file.PublicId) {
            console.log("Attempting to delete from Cloudinary with PublicId:", file.PublicId);
            try {
                await deleteFileFromCloudinary(file.PublicId);
                console.log("Successfully deleted from Cloudinary");
            } catch (cloudinaryError) {
                console.error("Cloudinary deletion error:", cloudinaryError);
                // continue with database delete 
            }
        }

        // Delete QR code if exists
        const deletedQR = await QRModel.findOneAndDelete({ fileId: file._id });
        console.log("QR code deletion result:", deletedQR ? "Deleted" : "Not found");

        // Delete file document
        await FileModel.findByIdAndDelete(fileId);
        console.log("File document deleted from database");

        res.status(200).send({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).send({
            success: false,
            message: 'Error deleting file',
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