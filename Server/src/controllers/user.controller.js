import User from "../models/auth.model.js";
import FriendRequest from "../models/request.model.js";

export const getRecommendation = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.Friends } },
                { isOnBoarded: true }
            ],
        });

        res.status(200).json(recommendedUsers);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" || error });
    }
}

export const getMyFriends = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("Friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.Friends)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" || error });
    }
}

export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        if (myId === recipientId) return res.status(400).json({ message: "You cannot send the friend request to Yourself" });

        const recipient = await User.findById(recipientId);

        if (recipient.Friends.includes[myId]) return res.status(400).json({ message: "You both are already Friends" });

        const exisitingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipentId, recipient: myId },
            ],
        });

        if (exisitingRequest) return res.status(400).json({ message: "You Already Send the Friend Request" });

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });

        res.status(201).json(friendRequest);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" || error });
    }
}

export const accepteFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) return res.status(400).json({ message: "Friend request not Found" });

        if (friendRequest.recipient.toString() !== req.user.id) return res.status(400).json({ message: "Kindly Authenticate First" });

        // Accept the friend request
        friendRequest.status = "accepted";
        await friendRequest.save();

        // Add each user to the other's Friends list
        await User.findByIdAndUpdate(friendRequest.sender, { $addToSet: { Friends: friendRequest.recipient } });
        await User.findByIdAndUpdate(friendRequest.recipient, { $addToSet: { Friends: friendRequest.sender } });

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" || error });
    }
}

export const getFriendRequest = async (req, res) => {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json({ incomingReqs, acceptedReqs });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" || error });
    }
}

export const getOutgoingFriendRequest = async (req, res) => {
    try {
        const getOutgoingReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(getOutgoingReqs);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" || error });
    }
}