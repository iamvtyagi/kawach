import QRCode from 'qrcode';
import QRModel from '../models/qrModel.js';

export const generateQRCode = async (req, res) => {
    try {
        const { fileId } = req.body; // Get the file ID from the request body
        const qrData = `File ID: ${fileId}`; // Customize the QR code data as needed
        console.log(`qrData : ${qrData}`);
        // Generate the QR code
        const qrCode = await QRCode.toDataURL(qrData);

        // Save the QR code to the database
        const newQRCode = new QRModel({
            fileId,
            qrCode,
        });
 

        await newQRCode.save();

        res.status(201).json({
            success: true,
            message: 'QR Code generated successfully',
            qrCode,
        });
        // const qr1Code = await QRCode.toDataURL(qrData);
        // console.log(`Generated QR Code: ${qr1Code}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error generating QR Code',
            error,
        });
    }
};
