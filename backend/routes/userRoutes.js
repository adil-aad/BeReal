import express from "express"
import { register, login } from "../controllers/authController.js"
import protect from "../middleware/authMiddleware.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
  getFriendRequests
} from "../controllers/userContoller.js";


const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/request/:id", protect, sendFriendRequest);
router.post("/accept/:id", protect, acceptFriendRequest);
router.get("/friends", protect, getFriends)
router.get("/requests", protect, getFriendRequests);


export default router