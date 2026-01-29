import jwt from "jsonwebtoken"
import User from "../models/User.js"


const protect = async (req, res, next) => {
    let token 
    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(" ")[1]
            console.log(`Token Found ${token}`)

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log(`Decoded Data: ${decoded}`)

            req.user = await User.findById(decoded.id).select("-password")

            next()
        } catch(error){
            console.error("JWT ERROR: ", error.message)
            return res.status(401).json({message : "Not Authorized"})
        }
    }

    if(!token){
        console.log("NO TOKEN PROVIDED")
        return res.status(401).json({message: "No Provided Token"})
    }
}

export default protect