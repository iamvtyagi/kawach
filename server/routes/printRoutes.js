import { Router } from 'express';
import FileModel from '../models/fileModel.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/:fileId', isAuthenticated, async (req, res) => {
    try {
        const { fileId } = req.params;
        
        // Fetch file details from MongoDB
        const file = await FileModel.findById(fileId);
        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }
        console.log('File Ready to Print');

        // Send file data to frontend
        res.status(200).json({
            success: true,
            file: {
                url: file.path,
                filename: file.filename,
                mimetype: file.mimetype
            }
        });
    } catch (error) {
        console.error('Print route error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing print request'
        });
    }
});

export default router;
