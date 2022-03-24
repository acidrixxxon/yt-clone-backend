import Video from './../Schema/VideoSchema.js'
import cloudinary from '../utils/cloudinary.js'
import User from './../Schema/UserSchema.js'
import { getDates } from '../utils/getDate.js'

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
            console.log(req.query)
            const page = req.query.page <= 0 ? 1 : req.query.page
            const limit = req.query.limit <= 0 ? 12 : req.query.limit
            const skip = (page - 1) * limit || 0
            if (page && limit) {
                const data = await Video.find({}).populate({path: 'channel',select: '-__v'}).select('-__v -updatedAt').limit(limit).skip(skip)

                return res.status(200).json({
                    length: data.length,
                    videos: data
                })
            } else {
                const data = await Video.find({}).populate({path: 'channel',select: '-__v'}).select('-__v -updatedAt')  

                return res.status(200).json({
                    length: data.length,
                    videos: data
                })
            }

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
            const data = await Video.findById({_id: id}).select('-__v -updatedAt').populate({path: 'channel',select: '_id name avatar subscribers'}).populate({path: 'comments',select: '-__v -updatedAt -video',options: {sort: {createdAt: -1}},populate: {path: 'author',select: '_id login avatar'} })

            if (!data) return res.status(404).json({message: 'Video was not found!'})

            return res.status(200).json({
                success: true,
                message: 'Видео успешно получено!',
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

    async likeVideo(req,res){
        try {
            const { id } = req.params
            const video = await Video.findById({_id: id})
            const user = await User.findById({_id: req.user._id})

            video.likes += 1
            await video.save()
            
            if (user.likes.find(arr => arr == id)) {
                return res.status(500).json({
                    message: 'Вы уже лайкали это видео!'
                })
            }
            user.likes.push(video._id)
            await user.save()

            return res.status(200).json({
                message: 'Вам понравилось это видео!',
                success: true,
                userlikes: user.likes
            })
        } catch (e) {
            console.log(e.message)
            return res.status(500).json({
                message: e.message
            })
        }
    }

    async unlikeVideo(req,res) {
        try {
            const { id }  = req.params
            const video = await Video.findById({_id: id})
            const user = await User.findById({_id: req.user._id})

            if ( video.likes > 0) video.likes -= 1
            await video.save()
            
            user.likes = user.likes.filter(item => item != id)
            await user.save()

            return res.status(200).json({
                message: 'Вы убрали лайк с этого видео!',
                success: true,
                userlikes: user.likes
            }) 
        } catch (error) {
            console.log(e.message)
            return res.status(500).json({
                message: e.message
            })
        }
    }

    async dislikeVideo(req,res) {
        try {
            const { id } = req.params
            const video = await Video.findById({_id: id})
            const user = await User.findById({_id: req.user._id})

            video.dislikes += 1
            await video.save()
            
            user.dislikes.push(video._id)
            await user.save()
            
            return res.status(200).json({
                message: 'Вам не понравилось это видео!',
                success: true,
                dislikes: user.dislikes
            })
        } catch (e) {
            console.log(e.message)
            return res.status(500).json({
                message: e.message
            })
        }
    }

    async undislikeVideo(req,res) {
        try {
            const { id }  = req.params
            const video = await Video.findById({_id: id})
            const user = await User.findById({_id: req.user._id})

            if ( video.dislikes > 0) video.dislikes -= 1
            await video.save()
            
            user.dislikes = user.dislikes.filter(item => item != id)
            await user.save()

            return res.status(200).json({
                message: 'Вы убрали дизлайк с этого видео!',
                success: true,
                userdislikes: user.dislikes
            }) 
        } catch (error) {
            console.log(e.message)
            return res.status(500).json({
                message: e.message
            })
        }
    }

    async getAllLikedVideos(req,res) {
        try {
            
            const user = await User.findById(req.user._id).select('-__v -password').populate({path: 'likes',select: '-__v -updatedAt -likes -dislikes -views -sourceUrl -description -createdAt',populate: {path: 'channel', select: '_id name'}})
            return res.json({
                message: 'Понравившиеся',
                success: true,
                liked: user.likes
            })
        } catch (e) {
            console.error(e.message)

            throw new Error('Не удалось получить понравившееся видео!',e.message)
        }
    }

    async getMySubscriptionsVideos(req,res){
        try {
            const user = await User.findById(req.user._id).select('subscriptions')
            // const videos = await Video.find().where('channel').in(user.subscriptions)

            const dates = getDates()
            const { today,yesterday,recently } = dates

             const todayVideos = await Video
                .find({
                    'channel': {$in: user.subscriptions},
                    'createdAt': {$gte: today.start,$lt: today.end}
                })
                .select('-likes -dislikes -__v -updatedAt -sourceUrl')
                .populate({path: 'channel',select: '_id name avatar'})
                .sort({createdAt: -1})

            const yesterdayVideos = await Video
                .find({
                    'channel': {$in: user.subscriptions},
                    'createdAt': {$gte: yesterday.start,$lt: yesterday.end}
                })
                .select('-likes -dislikes -__v -updatedAt -sourceUrl')
                .populate({path: 'channel',select: '_id name avatar'})
                .sort({createdAt: -1})

            const recentVideos =  await Video
                .find({
                    'channel': {$in: user.subscriptions},
                    'createdAt': {$lt: recently}
                })
                .select('-likes -dislikes -__v -updatedAt -sourceUrl')
                .populate({path: 'channel',select: '_id name avatar'})
                .sort({createdAt: -1})

            return res.status(200).json({
                message: 'Видео по вашим подпискам успешно получены!',
                success: true,
                videos: {
                    today: todayVideos,
                    yesterday: yesterdayVideos,
                    recently: recentVideos
                }
            })
        } catch (error) {
            
        }
    }
}

export default new VideoController()