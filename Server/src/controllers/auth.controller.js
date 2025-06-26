import User from "../models/auth.model.js";
import { assignJWT } from "../lib/utils/AssignJWT.js";
import { RandomProfileAvatar } from "../lib/utils/RandomProfileAvatar.js";
import { upsertStreamUser } from "../lib/stream.js";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const signUp = async (req, res) => {
    const { email, password, fullName } = req.body;
    try {
        if (!email || !password || !fullName) return res.status(400).json({ message: "All Fields are required" });

        if (password.length < 6) return res.status(400).json({ message: "Password Should be Atleast for 6 Characters" });

        if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid Email Format" });

        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "Email Already Exist Kindly, Use Different Email" });

        const RandomAvatar = RandomProfileAvatar();

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: RandomAvatar
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: RandomAvatar
            });
            console.log(`Stream User Created for ${newUser.id}`);
        } catch (error) {
            console.error('Error to Create Streamer User', error);
        }

        assignJWT(newUser.id, res);

        return res.status(201).json({ success: true, user: newUser });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).json({ message: "Email and Password is Invalid" });

        if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid Email Format" });

        const loggedinUser = await User.findOne({ email });

        if (!loggedinUser) return res.status(400).json({ message: "User not Found" });

        const isPasswordCorrect = await loggedinUser.matchPassword(password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Incorrect Passoword" });

        assignJWT(loggedinUser.id, res);

        return res.status(200).json({ message: "User Login Successfully", user: loggedinUser });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}

export const logout = async (req, res) => {
    res.clearCookie("jwt");
    return res.status(201).json({ message: "User logout Successfully" });
}

export const onboard = async (req, res) => {
    const userId = req.user._id;

    try {
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        const missingFields = [];
        if (!fullName) missingFields.push("fullName");
        if (!bio) missingFields.push("bio");
        if (!nativeLanguage) missingFields.push("nativeLanguage");
        if (!learningLanguage) missingFields.push("learningLanguage");
        if (!location) missingFields.push("location");

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "All Fields are Required",
                missingFields
            });
        }

        const updateUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnBoarded: true,
        }, { new: true });

        if (!updateUser) return res.status(400).json({ message: "User Not Found" });

        try {
            await upsertStreamUser({
                id: updateUser._id.toString(),
                name: updateUser.fullName,
                image: updateUser.profilePic || ""
            });
            console.log(`Stream User Created for ${updateUser.fullName}`);
        } catch (error) {
            console.error('Error to Create Streamer User', error);
        }

        return res.status(200).json({ success: true, User: updateUser });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

export const meFunc = async (req, res) => {
    res.status(200).json({success : true, user: req.user});  
}