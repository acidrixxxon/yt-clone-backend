import express from 'express'
import CommentCtrl from './../Controller/commentController.js'
import protect from '../utils/authMiddleware.js'
const router = express.Router()

router.post('/:id/add',protect,CommentCtrl.create)
router.post('/:id/delete',protect,CommentCtrl.deleteComment)


export default router