import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
import cookieParser from "cookie-parser"; 
import UserRoute from "./routes/UserRoute.js";
import "./models/index.js";


dotenv.config(); 

const app = express();
const port = process.env.PORT || 5000; 

app.use(cors({
    origin: 'https://tcc-fe-leon-dot-e-09-450704.uc.r.appspot.com', // Frontend 
    credentials: true // Izinkan pengiriman cookies
}));

app.use(express.json()); 
app.use(cookieParser()); 


app.use(UserRoute); 


app.listen(port, () => console.log(`Server up and running on port ${port}...`));
