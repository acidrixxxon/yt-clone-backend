import Channel from "../Schema/ChannelSchema.js"
import User from "../Schema/UserSchema.js"
import Video from '../Schema/VideoSchema.js'


class ChannelController {

    async create(req,res) {
        const { name,author } = req.body
            
        const newChannel = await Channel.create({name,author})
    
       return res.status(200).json({
            message: 'Channel was created!',
            success: true,
            channel: newChannel
        })
    }

    async getById(req,res) {
        const { id } = req.params

        const channel = await Channel.findById({_id: id}).populate(({path: 'author',select: '-password -__v'}))
        return res.status(200).json({channel})
    }

    async getAllChannels(req,res) {
        const channels = await Channel.find({}).populate({path: 'author',select: '-password -__v'}).populate({path: 'subscribers',select: '-password -__v'})
        if (!channels) return res.status(404).json({message: 'Channels not found!'})

        return res.status(200).json({
            success: true,
            message: 'Channels was founded!',
            channels
        })
    }

    async subscribeOnChannel(req,res) {
        const { id } = req.params

        const channel = await Channel.findById(id).populate({path: 'author', select: '-password -__v -subscriptions'})
        const user = await User.findById(req.user._id)

        user.subscriptions.push(channel._id)
        channel.subscribers.push(req.user._id)

        const updatedUser = await user.save()
        const updatedChannel = await channel.save()

        return res.status(200).json({message: 'Подписка на канал успешно оформлена!',updatedChannel})
    }

    async unsubscribeOnchannel(req,res) {
        const { id } = req.params
        
        const channel = await Channel.findById(id).populate({path: 'author', select: '-password -__v -subscriptions'})
        const user = await User.findById(req.user._id)

        user.subscriptions.filter( sub => sub._id !== channel._id)
        channel.subscribers.filter( sub => sub._id !== req.user._id)

        const updatedUser = await user.save()
        const updatedChannel = await channel.save()

        return res.status(200).json({message: 'Вы отписались от канала',updatedChannel})
    }

    async getMyChannel(req,res) {
        const channel = await Channel.findOne({author: req.user._id}).select('-__v')
        return res.status(200).json({
            message: 'Your channel!',
            channel
        })
    }

    async getChannelVideos(req,res){
        const { id } = req.params

        const videos = await Video.find({channel: id})

        return res.status(200).json({
            message: 'Видео канала найдены',
            success: true,
            videos
        })
    }
}


export default new ChannelController()