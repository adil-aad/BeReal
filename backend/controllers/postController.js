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

export const reactToPost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  const existingReaction = post.reactions.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (existingReaction) {
    existingReaction.emoji = req.body.emoji;
  } else {
    post.reactions.push({
      user: req.user._id,
      emoji: req.body.emoji,
    });
  }

  await post.save();
  res.json(post);
};


export const addComment = async (req, res) => {
  const post = await Post.findById(req.params.id);

  post.comments.push({
    user: req.user._id,
    text: req.body.text,
  });

  await post.save();
  res.json(post);
};
