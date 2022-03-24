import express from 'express'
import protect from './../utils/authMiddleware.js'
import ChannelCtrl from './../Controller/channelController.js'
const router = express.Router()



router.get('/mychannel',protect,ChannelCtrl.getMyChannel)
router.post('/create',ChannelCtrl.create)
router.get('/getsubschannels',protect,ChannelCtrl.getSubsChannels)
router.get('/:id', ChannelCtrl.getById)
router.get('/:id/subscribe',protect,ChannelCtrl.subscribeOnChannel)
router.get('/:id/unsubscribe', protect, ChannelCtrl.unsubscribeOnchannel)
router.get('/',ChannelCtrl.getAllChannels)
router.get('/:id/videos',ChannelCtrl.getChannelVideos)
router.post('/updatechannel',protect,ChannelCtrl.updateUserChannel)


export default router