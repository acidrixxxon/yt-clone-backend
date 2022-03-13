import express from 'express'
import Video from './../Schema/VideoSchema.js'
import Channel from './../Schema/ChannelSchema.js'
const router = express.Router()


router.get('/',async (req,res) => {
    try {
        const { query } = req.query
        const videos = await Video.find({title: new RegExp(query, 'i')}).select('-updatedAt -__v -sourceUrl').populate({path: 'channel', select: '-__v -author -subscribers'})
        const channels = await Channel.find({name: new RegExp(query, 'i')})

        if (videos.length == 0 || !videos) return res.status(200).json({
            success: false,
            message: 'Видео не найдено!'
        })
        
        return res.status(200).json({
            success: true,
            message: 'Видео найдено!',
            videos,
            channels
        })
    } catch (e) {
        console.log(e)
    }
})

export default router