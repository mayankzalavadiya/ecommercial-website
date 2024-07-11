import express from "express";
import colors from "colors";
import dotenv from 'dotenv';
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import categoryRoutes from "./routes/categoryRoute.js"
import productRoute from "./routes/productRoute.js"
import cors from "cors";
import path from "path";
dotenv.config();


connectDB();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
// app.use(express.static(path.join(__dirname,'./client/build')))

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/products',productRoute);

app.get((req,res)=>{
    res.send("hello world")
})

// app.use("*",function(req,res){
//     res.sendFile(path.join(__dirname,'./client/build/index.html'))
// })

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
})


const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
})
