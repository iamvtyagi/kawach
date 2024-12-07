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
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print ${fileDoc.filename}</title>
                <style>
                    body {
                        margin: 0;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        text-align: center;
                    }
                    .qr-container {
                        margin: 20px 0;
                        pointer-events: none;
                    }
                    img {
                        max-width: 300px;
                        pointer-events: none;
                        -webkit-user-drag: none;
                        -khtml-user-drag: none;
                        -moz-user-drag: none;
                        -o-user-drag: none;
                        user-drag: none;
                    }
                    .info {
                        margin: 20px 0;
                        color: #666;
                    }
                </style>
                <script>
                    // Disable right click
                    document.addEventListener('contextmenu', event => event.preventDefault());
                    
                    // Disable keyboard shortcuts
                    document.addEventListener('keydown', function(e) {
                        if ((e.ctrlKey || e.metaKey) && 
                            (e.key === 's' || e.key === 'S' || e.key === 'c' || e.key === 'C')) {
                            e.preventDefault();
                        }
                    });

                    // Disable drag and drop
                    document.addEventListener('dragstart', function(e) {
                        e.preventDefault();
                    });

                    // Print automatically and close
                    window.onload = function() {
                        window.print();
                        // Optional: Close window after printing
                        // window.onafterprint = function() {
                        //     window.close();
                        // };
                    }
                </script>
            </head>
            <body>
                <div class="container">
                    <h1>Print ${fileDoc.filename}</h1>
                    ${
                        fileDoc.mimetype.startsWith('image/') 
                        ? `<div class="qr-container"><img src="${qrDoc.fileUrl}" alt="${fileDoc.filename}"></div>`
                        : `
                            <div class="info">
                                <p>Filename: ${fileDoc.filename}</p>
                                <p>Type: ${fileDoc.mimetype}</p>
                                <p>Size: ${(fileDoc.size / 1024).toFixed(2)} KB</p>
                                <p>Upload Date: ${new Date(fileDoc.uploadDate).toLocaleString()}</p>
                            </div>
                        `
                    }
                </div>
            </body>
            </html>
        `;
        res.send(htmlContent);
    } catch (error) {
        console.error('Print error:', error);
        res.status(500).send({
            success: false,
            message: "Error processing print request"
        });
    }
});

export default router;
