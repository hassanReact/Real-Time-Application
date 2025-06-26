import express from 'express'
import authRoutes from './routes/auth.route.js'
import "dotenv/config"
import { connectDB } from './database/db.js'
import cookieParser from 'cookie-parser'
import UserRouter from './routes/user.route.js'
import cors from 'cors'

const app = express();
const PORT = process.env.PORT;
const CLIENT = process.env.CLIENT_URI;

app.use(cors({
  origin: 'http://localhost:5173', // Allow this origin
  credentials: true // if you use cookies or HTTP auth
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/users', UserRouter);
app.use('/api/chat', UserRouter);

connectDB();

app.listen(PORT | 5000, () => {
    console.log(`Server is listening at port ${PORT}`)
});