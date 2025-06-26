import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log(`MongoDb is Connected`)
        });
    } catch (error) {
        console.log("Error in Connecting to MongoDB", error)
    }
}