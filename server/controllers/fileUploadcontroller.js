import FileModel from '../models/fileModel.js';
import QRCode from 'qrcode';

export const uploadFile = async (req, res) => {
    try {
        const { filename, mimetype, size } = req.file;
        const userId = req.user._id; // Assuming user info is stored in req.user after authentication

        const newFile = new FileModel({
            filename,
            path: req.file.path,
            mimetype,
            size,
            user: userId, // Associate the file with the user
        });

        await newFile.save();
        const qrData = `http://example.com/download/${newFile._id}`;
        const qr1Code = await QRCode.toDataURL(qrData);
        console.log(`Generated QR Code: ${qr1Code}`);
        res.status(201).send('File uploaded successfully');
    } catch (error) {
        res.status(500).send('Error uploading file');
    }
};
