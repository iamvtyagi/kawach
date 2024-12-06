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
    // The localFilePath is passed as an argument to this function. This path is expected to be the path of the file
    // that needs to be uploaded to Cloudinary. This path is likely obtained from a file upload process, such as
    // using the multer middleware in Express.js to handle multipart/form-data requests.
    try {
        if (!localFilePath) throw new Error('File path is required');
        // Upload file on cloudinary
        // This line initiates the upload process to Cloudinary. It takes the localFilePath as the first argument, 
        // which is the path to the file on the local machine that needs to be uploaded. The second argument is an 
        // options object that can be used to specify various settings for the upload, such as the folder where the 
        // file should be stored, the type of resource being uploaded, and more.
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: "uploads",
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
        resource_type: 'auto',
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