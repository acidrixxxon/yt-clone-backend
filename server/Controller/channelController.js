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
            message: `Найдено ${channels.length} каналов!`,
            channels,
        })
    }

    async getSubsChannels(req,res) {
        let channels = await Channel.find({}).select('-__v')
        if (!channels) return res.status(404).json({message: 'Не удалось получить каналы!',success: false})

        const user = await User.findById(req.user._id)
        if (!user) return res.status(404).json({message: 'Не удалось получить пользователя!',success: false})

        channels = channels.map(channel => {
            const subscribed = user.subscriptions.find(item => item == channel._id.toString()) ? true : false
            return {
                ...channel._doc,
                subscribed
            }
        })

        return res.json({
            message: 'Каналы получены успешно!',
            success: true,
            channels
        })
    }

    async subscribeOnChannel(req,res) {
        const { id } = req.params

        const channel = await Channel.findById(id)
        const user = await User.findById(req.user._id)

        user.subscriptions.push(channel._id)
        channel.subscribers.push(req.user._id)

        
        const updatedUser = await user.save()
        const updatedChannel = await channel.save()

        const finalUser = await User.findById(updatedUser._id).select('-__v -password').populate({path: 'subscriptions',select: '-subscribers -__v -author'})
        const finalChannel = await Channel.findById(updatedChannel._id).select('-__v')
        
        return res.status(200).json({
            success: true,
            message: 'Подписка на канал успешно оформлена!',
            updatedUser: finalUser,
            updatedChannel: finalChannel
        })
    }

    async unsubscribeOnchannel(req,res) {
        const { id } = req.params
        
        const channel = await Channel.findById(id)
        const user = await User.findById(req.user._id)
        
        user.subscriptions = user.subscriptions.filter( sub => sub != channel._id.toString())
        channel.subscribers = channel.subscribers.filter( sub => sub._id != req.user._id.toString())
      
        
        const updatedUser = await user.save()
        const updatedChannel = await channel.save()

        
        const finalUser = await User.findById(updatedUser._id).select('-password -__v').populate({path: 'subscriptions',select: '-subscribers -__v -author'})
        console.log(updatedChannel)
        return res.status(200).json({
            message: 'Вы отписались от канала',
            success: true,
            updatedChannel,
            updatedSubscriptions: finalUser.subscriptions
        })
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

    async updateUserChannel(req,res) {
        const channel = await Channel.findOneAndUpdate({author: req.user._id},req.body)

        const updatedChannel = await Channel.findById(channel._id).select('-__v')
        return res.json({
            message: 'Канал успешно обновлен!',
            success: true,
            updatedChannel
        })
    }
}


export default new ChannelController()