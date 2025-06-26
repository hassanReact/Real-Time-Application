import express from 'express'
import { getRecommendation, getMyFriends, getOutgoingFriendRequest, getFriendRequest, sendFriendRequest, accepteFriendRequest } from "../controllers/user.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get('/', getRecommendation);
router.get('/friends', getMyFriends);
router.post('/friend-request/:id', sendFriendRequest)
router.put('/friend-request/:id/accept', accepteFriendRequest);
router.get('/friend-requests', getFriendRequest);
router.get('/outgoing-friend-requests', getOutgoingFriendRequest);

export default router;


