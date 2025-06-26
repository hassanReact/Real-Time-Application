import jwt from "jsonwebtoken"

export const assignJWT = async (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECERET, { expiresIn: '7d' })

    return res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite : "strict",
        secure: process.env.NODE_ENV === "production"
    })
}