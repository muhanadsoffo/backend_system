import express from 'express';
import cors from "cors"
import mongoose from "mongoose";
import "dotenv/config"
import {connectDB} from "./db/connect.js";
import cookieParser from "cookie-parser";
import {authRouter} from "./routes/authRoutes.js";
import {errorHandler} from "./middleware/errorHandler.js";


const port = Number(process.env.PORT ?? 8000);
const uri= process.env.MONGO_URI ;

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }))
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

if(!uri) throw new Error("Missing uri for MONGO");
await connectDB(uri)

app.get("/health", (req, res) => {
    res.json({ ok: true, db: mongoose.connection.readyState })
})

app.use(cookieParser());
app.use("/auth", authRouter);
app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port} http://localhost:${port}`));