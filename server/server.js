// package.json mei mene type modules set kiya hai thats why now i can use this import export system
import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDb from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import fileRoutes from './routes/fileRoutes.js';


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
app.use(express.json());
app.use(morgan('dev'))


//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/file", fileRoutes); // routes for file operations (upload, fetch, and QR generation)



//rest api

app.get("/", (req, res) => {
  res.send({
    message: "chal gya"
  })
})


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`connected to server ${process.env.DEV_MODE} mode with port ${PORT}`.bgCyan.white);
});