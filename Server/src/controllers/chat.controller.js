import { generateStreamToken } from "../lib/stream"

export const getStreamToken = async (req, res) => {
    try {
        const token = generateStreamToken(req.user.id);

        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ message: "Interval Servor Error" || error })
    }
}