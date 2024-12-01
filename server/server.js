// package.json mei mene type modules set kiya hai thats why now i can use this import export system
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



//rest object
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// configure env
 dotenv.config()
 //() es config mei es brackets mei path dena hota   hai hamare case mei root par hai thats why we are not giving path

 //database config 
 connectDb();


//middlewares
     app.use(cors())
     app.use(express.json());
    app.use(morgan('dev'))


 // multer DiskStorage
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './public/images/upload') // Fixed path - needs to be relative with ./
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
          cb(null, uniqueSuffix); 
        }
      })
      
    const upload = multer({ storage: storage })

    //routes

app.use("/api/v1/auth", authRoutes);

app.get('/upload', (req, res) => {
    res.render('upload');
});




app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    res.send('File uploaded successfully');
});
    
    

//rest api

app.get("/",(req,res)=>{
    res.send({
        message: "chal gya"
    })
})

// Add the new route for file uploads
app.use("/api/v1/files", fileUploadRoutes);

// Add the new route for QR code generation
app.use("/api/v1/qr", qrRoutes);

// fetching the qr code
app.use('/api/v1', fileFetchRoute);

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`connected to server ${process.env.DEV_MODE} mode with port ${PORT}`.bgCyan.white);
});