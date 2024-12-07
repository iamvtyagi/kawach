import QRCode from 'qrcode';
import QRModel from '../models/qrModel.js';
import { uploadQRCodeBuffer } from '../utils/cloudinary.js';

// Generate QR code from cloudinary URL
export const generateQRCode = async (fileId, fileUrl) => {  //fileId = file in database ka doc ka -id ha , fileUrl = cloudinary URL
    try {
        // Generate QR code as buffer
        const buffer = await QRCode.toBuffer(fileUrl, {
            errorCorrectionLevel: 'H',
            type: 'png',
            quality: 0.92,
            margin: 1
        });
        
        // Upload buffer directly to Cloudinary
        const cloudinaryResponse = await uploadQRCodeBuffer(buffer);

        // Save QR code to database
        const newQRCode = new QRModel({
            fileId,   // file in database ka doc ka -id ha
            qrCode: cloudinaryResponse.url,   // qr code ka cloudinary url hai isiko client mai bejna hai qr display krana ka lia 
            fileUrl    // isma original file ka cloudinary url hai
        });

        await newQRCode.save();
        return cloudinaryResponse.url;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};
