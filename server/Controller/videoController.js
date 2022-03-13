import Video from './../Schema/VideoSchema.js'
import cloudinary from '../utils/cloudinary.js'

class VideoController {

    async createVideo(req,res) {
        try {
            const { title,description,channel,thumbnail } = req.body
            const uploadData = await cloudinary.uploader.upload(req.files.file.tempFilePath,{
                upload_preset: 'yt-clone',
                resource_type: 'video'
            })
            if (!uploadData) return res.status(500).json({message: 'Video was not uploaded!'})


            console.log(uploadData)

            const newVideo = await Video.create({
                title,
                description,
                channel,
                thumbnail,
                sourceUrl: uploadData.url
            })

            if (!newVideo) return res.status(500).json({message: 'Video was not saved to db!'})

            console.log(newVideo)

            return res.status(200).json({
                success: true,
                data: newVideo
            })
        } catch (error) {
            console.log(error)

            return res.status(500).json({
                message: error
            })
        }
    }

    async getAllVideos(req,res) {
        try {
            const data = await Video.find({}).populate('channel')

            return res.status(200).json({
                videos: data
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: error
            })
        }
    }

    async getVideoById(req,res) {
        try {
            const { id } = req.params
            const data = await Video.findById({_id: id}).populate({path: 'channel',select: '_id name avatar subscribers'})

            if (!data) return res.status(404).json({message: 'Video was not found!'})

            return res.status(200).json({
                success: true,
                video: data
            })
        } catch (error) {
            console.log(error)

            return res.status(500).json({
                message: error
            })
        }
    }

    async addVideoView(req,res) {
        try {
            const { id } = req.params
        
            const video = await Video.findById(id)
            video.views += 1

            const updatedVideo = await video.save()

            if (updatedVideo) return res.status(200).json({
                success: true,
                message: 'Просмотр видео добавлен'
            })


        } catch (e) {
            console.log(e.message)
            throw new Error('Не удалось добавить просмотр видео')
        }
    }
}


export default new VideoController()