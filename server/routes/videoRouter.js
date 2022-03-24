import express from 'express'
import VideoCtrl from './../Controller/videoController.js'
import protect from './../utils/authMiddleware.js'

const router  = express.Router()

router.post('/uploadfile',protect, VideoCtrl.createVideo)
router.get('/getall', VideoCtrl.getAllVideos)
router.get('/getsubsvideos',protect,VideoCtrl.getMySubscriptionsVideos)
router.get('/:id',VideoCtrl.getVideoById)
router.get('/:id/addview',VideoCtrl.addVideoView)
router.get('/:id/like',protect,VideoCtrl.likeVideo)
router.get('/:id/unlike',protect,VideoCtrl.unlikeVideo)
router.get('/:id/dislike',protect,VideoCtrl.dislikeVideo)
router.get('/:id/undislike',protect,VideoCtrl.undislikeVideo)
router.post('/getlikedvideos',protect,VideoCtrl.getAllLikedVideos)


export default router