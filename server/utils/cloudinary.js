import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload Document to cloudinary directly
export const uploadFileOnCloudinary = async (file) => {
    try {
        if (!file) throw new Error('File is required');
        // Upload file on cloudinary
        const response = await cloudinary.uploader.upload(file.path, {
            folder: "uploads",
            resource_type: "auto"
        });
        console.log("File uploaded successfully", response.url);
        return response;
    } catch (err) {
        console.error("Cloudinary upload failed:", err);
        throw err;
    }
}

// Upload QR Code buffer to cloudinary directly
export const uploadQRCodeBuffer = async (buffer) => {
    try {
        if (!buffer) throw new Error('Buffer is required');
        
        // Convert buffer to base64 string
        const base64String = buffer.toString('base64');
        const dataURI = `data:image/png;base64,${base64String}`;
        
        // Upload buffer to cloudinary
        const response = await cloudinary.uploader.upload(dataURI, {
            folder: 'qr_codes',
            resource_type: 'auto'
        });
        
        console.log('QR Code uploaded successfully:', response.url);
        return response;
    } catch (err) {
        console.error('Error uploading QR code:', err);
        throw err;
    }
};

// Delete file from Cloudinary
export const deleteFileFromCloudinary = async (publicId) => {
    try {
        if (!publicId) throw new Error('Public ID is required');
        
        // Delete the file from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "auto"  // auto detect the resource type (image, video, raw)
        });

        if (result.result === 'ok') {
            console.log('File deleted successfully from Cloudinary');
            return { success: true, message: 'File deleted successfully' };
        } else {
            throw new Error('Failed to delete file from Cloudinary');
        }
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw error;
    }
};