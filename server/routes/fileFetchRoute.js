import express from 'express';
import FileModel from '../models/fileModel.js';

const router = express.Router();

// Route to fetch file by fileId
router.get('/file/:id', async (req, res) => {
    try {
        const fileId = req.params.id; // Get the fileId from the URL parameters
        const file = await FileModel.findById(fileId); // Fetch the file from the database

        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        res.status(200).json({ success: true, file }); // Return the file details
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching file', error });
    }
});

export default router;