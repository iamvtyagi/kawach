import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET                   
});

// Generate a unique public ID
const generatePublicId = (prefix) => {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    return `${prefix}_${timestamp}_${randomString}`;
};

// Upload Document to cloudinary directly
export const uploadFileOnCloudinary = async (file) => {
    try {
        if (!file) throw new Error('File is required');
        
        // Generate a unique public ID for the file
        const publicId = generatePublicId('file');
        
        // Upload file on cloudinary
        const response = await cloudinary.uploader.upload(file.path, {
            folder: "uploads",
            resource_type: "auto",
            public_id: publicId
        });
        console.log("File uploaded successfully", response.url);
        return response;
    } catch (err) {
        console.error("Cloudinary upload failed:", err);
        throw err;
    }
};

// Upload QR Code buffer to cloudinary directly
export const uploadQRCodeBuffer = async (buffer) => {
    try {
        if (!buffer) throw new Error('Buffer is required');
        
        // Generate a unique public ID for the QR code
        const publicId = generatePublicId('qr');
        
        // Convert buffer to base64
        const base64String = buffer.toString('base64');
        const dataURI = `data:image/png;base64,${base64String}`;
        
        // Upload QR code to cloudinary
        const response = await cloudinary.uploader.upload(dataURI, {
            folder: "qrcodes",
            public_id: publicId
        });
        console.log("QR Code uploaded successfully", response.url);
        return response;
    } catch (err) {
        console.error("QR Code upload to Cloudinary failed:", err);
        throw err;
    }
};

// Delete file from Cloudinary
export const deleteFileFromCloudinary = async (publicId) => {
    try {
        if (!publicId) throw new Error('Public ID is required');
        
        // Try deleting as image first (most common case)
        try {
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: "image"
            });
            if (result.result === 'ok') {
                console.log('File deleted successfully from Cloudinary');
                return { success: true, message: 'File deleted successfully' };
            }
        } catch (error) {
            console.log('Not an image, trying raw file...');
        }

        // If image deletion failed, try as raw
        try {
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: "raw"
            });
            if (result.result === 'ok') {
                console.log('File deleted successfully from Cloudinary');
                return { success: true, message: 'File deleted successfully' };
            }
        } catch (error) {
            console.log('Not a raw file either...');
        }

        throw new Error('Failed to delete file from Cloudinary');
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw error;
    }
};