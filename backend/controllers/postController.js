import Post from "../models/Post.js"

export const createPost = async (req, res) => {
    try {
        const frontImage = req.files.front[0].path
        const backImage = req.files.back[0].path

        const post = await Post.create({
            user: req.user._id,
            frontImage,
            backImage,
            caption: req.body.caption
        })

        res.status(201).json(post)
    } catch(error){
        res.status(500).json({ message: error.message})
    }
}

export const getFeed = async (req, res)=>{
    try{
        const posts = await Post.find()
        .populate("user", "username profilePic")
        .sort({ createdAt: -1   })

        res.json(posts)

    }  catch (error){
        res.status(500).json({message: error.message})
    }

}