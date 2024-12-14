import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import connectDb from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import fileRoutes from './routes/fileRoutes.js'
import printRoutes from './routes/printRoutes.js';

// Log environment variables (without sensitive data)
console.log('Environment Variables Loaded:', {
    PORT: process.env.PORT,
    DEV_MODE: process.env.DEV_MODE,
    MONGO_URL_EXISTS: !!process.env.MONGO_URL
});

// Rest object
const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

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
app.use(morgan('dev'))

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/file", fileRoutes); // routes for file operations (upload, fetch, and QR generation)
app.use('/api/v1/print', printRoutes);

//rest api

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Kawach API"
  })
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`.bgCyan.white);
});