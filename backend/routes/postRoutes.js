import express from "express"
import upload from "../middleware/uploadMiddleware.js"
import protect from "../middleware/authMiddleware.js"
import { createPost, getFeed, reactToPost, addComment} from "../controllers/postController.js"

const router = express.Router()

router.post( 
    "/",
    protect,
    upload.fields([
        {name: "front", maxCount: 1},
        {name: "back", maxCount: 1}
    ]),
    createPost
)

router.get("/", protect, getFeed)
router.post("/:id/react", protect, reactToPost)
router.post("/:id/comment", protect, addComment)

export default router