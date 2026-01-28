import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import path from "path"
import { fileURLToPath } from "url";


dotenv.config()

connectDB()


const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/api/posts", postRoutes)


app.get("/", (req, res) =>{
    res.send("Backend Running")
})


const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})