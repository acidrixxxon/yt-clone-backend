import express from 'express'
const router = express.Router()
import UserCtrl from './../Controller/userController.js'
import asyncHandler from 'express-async-handler'
import protect from '../utils/authMiddleware.js'

router.post('/register', asyncHandler(UserCtrl.register))
router.post('/login',asyncHandler(UserCtrl.login))
router.get('/',UserCtrl.getAllUsers)
router.get('/me',protect,UserCtrl.getMe)
router.get('/watchlater/:id/add',protect,UserCtrl.addWatchLater)
router.get('/watchlater/:id/remove',protect,UserCtrl.removeWatchLater)
router.get('/watchlater',protect,UserCtrl.getWatchLater)
router.post('/updateprofile',protect,UserCtrl.updateUserProfile)
router.get('/getlikesdislikes',protect,UserCtrl.getMyLikesAndDislikes)


export default router