import express from 'express'
import VideoCtrl from './../Controller/videoController.js'
import protect from './../utils/authMiddleware.js'

const router  = express.Router()

router.post('/uploadfile',protect, VideoCtrl.createVideo)
router.get('/getall', VideoCtrl.getAllVideos)
router.get('/:id',VideoCtrl.getVideoById)
router.get('/:id/addview',VideoCtrl.addVideoView)

export default router