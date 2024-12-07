import express from 'express';
import QRModel from '../models/qrModel.js';
import FileModel from '../models/fileModel.js';
import mongoose from 'mongoose';

const router = express.Router();

// Route to handle print requests
router.get('/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).send({
                success: false,
                message: "Invalid file ID format"
            });
        }

        const [qrDoc, fileDoc] = await Promise.all([
            QRModel.findOne({ fileId }),
            FileModel.findById(fileId)
        ]);
        
        if (!qrDoc || !fileDoc) {
            return res.status(404).send({
                success: false,
                message: "File not found"
            });
        }

        // For PDFs, redirect to the file URL
        if (fileDoc.mimetype === 'application/pdf') {
            return res.redirect(qrDoc.fileUrl);
        }

        // For other files, send print-optimized HTML
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print ${fileDoc.filename}</title>
                <style>
                    body {
                        margin: 0;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        display: block;
                        margin: 0 auto;
                    }
                    .info {
                        max-width: 800px;
                        margin: 20px auto;
                    }
                    @media print {
                        .no-print {
                            display: none !important;
                        }
                    }
                </style>
            </head>
            <body>
                ${
                    fileDoc.mimetype.startsWith('image/') 
                    ? `<img src="${qrDoc.fileUrl}" alt="${fileDoc.filename}">`
                    : `
                        <div class="info">
                            <h1>${fileDoc.filename}</h1>
                            <p>Type: ${fileDoc.mimetype}</p>
                            <p>Size: ${(fileDoc.size / 1024).toFixed(2)} KB</p>
                            <p>Upload Date: ${new Date(fileDoc.uploadDate).toLocaleString()}</p>
                            <a href="${qrDoc.fileUrl}" class="no-print" target="_blank">Download File</a>
                        </div>
                    `
                }
                <script>
                    // Auto-trigger print dialog
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Print error:', error);
        res.status(500).send({
            success: false,
            message: "Error processing print request"
        });
    }
});

export default router;
