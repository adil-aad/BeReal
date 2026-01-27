import mongoose from "mongoose"


const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please add a username"],
            unique: true
        },
        email: {
            type: String,
            required: [true, "Please Enter Your Email"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Please Enter Password"]
        },
        profilepic: {
            type: String,
            default: ""
        }, 
        friends: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        friendrequests: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    },
    { timestamps: true}
)

const User = mongoose.model("User", userSchema)
export default User