import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
import cookieParser from "cookie-parser"; 
import UserRoute from "./routes/UserRoute.js";


dotenv.config(); // Panggil dotenv.config() untuk memuat variabel lingkungan

const app = express();
// Port dari .env atau default 5000
const port = process.env.PORT || 5000; 

// Konfigurasi CORS yang benar untuk mengizinkan kredensial
app.use(cors({
    origin: 'https://tcc-fe-leon-dot-e-09-450704.uc.r.appspot.com', // Frontend 
    credentials: true // Izinkan pengiriman cookies
}));

app.use(express.json()); 
app.use(cookieParser()); 


app.use(UserRoute); // Untuk notes


app.listen(port, () => console.log(`Server up and running on port ${port}...`));
