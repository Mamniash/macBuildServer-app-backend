import express from 'express'
import { authUser, registerUser, getUsers } from './auth.controller.js'

const router = express.Router()
router.route('/login').post(registerUser)
router.route('/login').get(authUser)
router.route('/all').get(getUsers)

export default router
