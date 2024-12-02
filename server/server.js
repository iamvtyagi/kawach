import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDb from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises'; // Use `fs/promises` for modern async file handling
import FileModel from './models/fileModel.js'; // Import the FileModel with .js extension
import qrRoutes from './routes/qrRoute.js'; // Import the QR code routes
import fileUploadRoutes from './routes/fileUploadRoute.js'
import fileFetchRoute from './routes/fileFetchRoute.js';

// Load environment variables
dotenv.config({ path: './.env' });

// Log environment variables (without sensitive data)
console.log('Environment Variables Loaded:', {
    PORT: process.env.PORT,
    DEV_MODE: process.env.DEV_MODE,
    MONGO_URL_EXISTS: !!process.env.MONGO_URL
});

// Rest object
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Database config
connectDb();

// Middlewares
app.use(cors());
app.use(morgan('dev'));

// Multer DiskStorage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/upload');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

// Routes
app.use("/api/v1/auth", authRoutes);
app.get('/upload', (req, res) => {
    res.render('upload');
});
app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    res.send('File uploaded successfully');
});

// Rest API
app.get("/", (req, res) => {
    res.send({
        message: "Server is running"
    });
});

// Add the new route for file uploads
app.use("/api/v1/files", fileUploadRoutes);

// Add the new route for QR code generation
app.use("/api/v1/qr", qrRoutes);

// Fetching the QR code
app.use('/api/v1', fileFetchRoute);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Connected to server ${process.env.DEV_MODE} mode with port ${PORT}`.bgCyan.white);
});