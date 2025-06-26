import jwt from 'jsonwebtoken'
import User from '../models/auth.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) return res.status(400).json({ message: "UnAuthorized - No token provided" });

        const decode = jwt.verify(token, process.env.JWT_SECERET);

        if (!decode) return res.status(400).json({ message: "UnAuthorized - Invalid token provided" });

        const user = await User.findById(decode.userId).select('-password');

        if (!user) return res.status(400).json({ message: "User not Found" });

        req.user = user;

        next()
    } catch (error) {
        console.log("Error in protectRoute middleware", error);
    }
}