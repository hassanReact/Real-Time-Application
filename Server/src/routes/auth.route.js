import express from 'express'
import { login, logout, signUp, onboard, meFunc } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.post('/logout', logout)
router.post('/onboarding', protectRoute, onboard);
router.get('/me', protectRoute, meFunc)

export default router