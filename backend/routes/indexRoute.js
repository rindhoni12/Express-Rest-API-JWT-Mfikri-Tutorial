import express from 'express'
import { getUsers, registerUser, loginUser, logoutUser } from '../controllers/userController.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { refreshToken } from '../controllers/refreshToken.js'

const router = express.Router()

router.get('/users', verifyToken, getUsers)
router.post('/users/register', registerUser)
router.post('/users/login', loginUser)
router.get('/users/token', refreshToken)
router.delete('/users/logout', logoutUser)


export default router