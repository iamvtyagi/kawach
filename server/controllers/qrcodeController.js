import QRCode from 'qrcode';
import QRModel from '../models/qrModel.js';
import crypto from 'crypto';
import { uploadQRCode } from '../utils/cloudinary.js';
import fs from 'fs/promises';
import path from 'path';

// Generate QR code from cloudinary URL
export const  generateQRCode = async (fileId, fileUrl) => {  //fileId = file in database ka doc ka -id ha , fileUrl = cloudinary URL
    try {
        // Set QR code directory path
        const qrCodeDir = './public/qrcodes';

        // Generate unique filename
        const uniqueId = crypto.randomBytes(12).toString('hex');
        const qrCodePath = path.join(qrCodeDir, `qr_${uniqueId}.png`);

        // Generate QR code
        await QRCode.toFile(qrCodePath, fileUrl);
        
        // Upload QR code to cloudinary
        const cloudinaryResponse = await uploadQRCode(qrCodePath);

        // Save QR code to database
        const newQRCode = new QRModel({
            fileId,   // file in database ka doc ka -id ha
            qrCode: cloudinaryResponse.url,   // qr code ka cloudinary url hai isiko client mai bejna hai qr display krana ka lia 
            fileUrl    // isma original file ka cloudinary url hai
        });

        // Clean up the local file after successful upload
        try {
            await fs.unlink(qrCodePath);
            console.log('Local QR code file cleaned up successfully');
        } catch (unlinkError) {
            console.error('Error cleaning up local QR code file:', unlinkError);
            // Continue execution even if cleanup fails
        }

        await newQRCode.save();
        return cloudinaryResponse.url;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};
