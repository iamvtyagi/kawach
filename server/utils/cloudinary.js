import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';   //file system module inbuilt in nodejs
import dotenv from 'dotenv';

dotenv.config();

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload Document to the 'documents' folder
export const uploadFileOnCloudinary = async (localFilePath) => {  //localFilePath -> from multer
    try {
        if (!localFilePath) throw new Error('File path is required');
        // Upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"  //auto detect the file type
        })
        //file has been uploaded successfully
        console.log("File uploaded successfully", response.url); //response. many options available like url, public_id,size,format,original_filename etc
        return response;
    } catch (err) {
        // Handle the error
        console.error("Cloudinary upload failed:", err);
        // Attempt to delete the local file
        try {
            fs.unlinkSync(localFilePath); // This will throw an error if deletion fails
            console.log("Local file deleted successfully.");
        } catch (unlinkErr) {
            console.error("Failed to delete local file:", unlinkErr);
        }
    }
}

// Upload QR Code to the 'qr_codes' folder
export const uploadQRCode = async (localFilePath) => {
    try {
      const response = await cloudinary.uploader.upload(localFilePath, {
        folder: 'qr_codes',  // Specify folder
        resource_type: 'image',  // QR codes are images
      });
      console.log('QR Code uploaded successfully:', response.url);
      return response;
    } catch (err) {
      console.error('Error uploading QR code:', err);
      throw err;
    }
  };