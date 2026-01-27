import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const register = async (req, res) => {
    try {
        const {username, email, password} = req.body

        const userExists = await User.findOne({email})
        if (userExists)
            return res.status(400).json({message: "User already exists"})

        const hasedPassword =   await bcrypt.hash(password, 10)

        const user = await User.create({
            username,
            email,
            password: hasedPassword,
        })

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email
        })
    }
    catch (error){
        res.status(500).json({message: error.message})
    }
}

export const login = async (req, res) =>{
    try {
        const {email, password} = req.body

        const user = await User.findOne({ email })

        if ( user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                {id: user._id},
                process.env.JWT_SECRET,
                { expiresIn: "7d"}

            )

            // You send the user data and the token back to the frontend to save this token in localStorage so the user doesn't have to log in every time they refresh the page.
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token,
            })
        }
        else{
            res.status(401).json({message: "Invalid Credentials"})
        }
    } catch(error){
        res.status(500).json({message: error.message})
    }
}