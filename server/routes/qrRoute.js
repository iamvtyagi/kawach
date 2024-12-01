import express from 'express';
import { generateQRCode } from '../controllers/qrcodeController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to generate QR code
router.post('/generate', isAuthenticated, generateQRCode);

export default router;
