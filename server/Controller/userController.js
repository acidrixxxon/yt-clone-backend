import User from './../Schema/UserSchema.js'
import Channel from './../Schema/ChannelSchema.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/jwt.js'

class UserController {

    async login(req,res) {
        try {
            const { email,password } = req.body
            if ( !email,!password ) return res.status(500).json({message: 'Missing some credential'})

            const user = await User.findOne({email}).populate({path: 'subscriptions',select: '-author -subscribers -__v'})
           
            
            if(!user) return res.status(401).json({message: 'User with same email was not founded in DB!'})
            const truePassword = bcrypt.compare(password,user.password)


            if (user && truePassword) {
                const token = generateToken(user._id)

                res.cookie('access_token',token,{
                    maxAge: 3600 * 24
                })
                return res.status(200).json({
                    message: 'User logged!',
                    success: true,
                    user: {
                        _id: user._id,
                        email: user.email,
                        login: user.login,
                        avatar: user.avatar,
                        subscriptions: user.subscriptions
                    },
                    token
                })
            }

        } catch (error) {
            console.error(error)

            return res.status(404).json({
                message: error
            })
        }
    }

    async register (req,res) {
        try {
            const { login,email,password,avatar } = req.body

            if( !login || !email || !password) return res.status(500).json({message: 'Missing some credential!'})

            const existEmail =  await User.find({email})
            if (existEmail == true) return res.status(500).json({message: 'User with same email is exist!'})

            const existLogin = await User.find({login})
            if (existLogin === true) return res.status(500).json({message: 'User with same login is exist!'})


            const salt = await bcrypt.genSalt(3)
            const hashedPassword = await bcrypt.hash(password,salt)

            const user = await User.create({login,email,password: hashedPassword,avatar})
            const newChannel = await Channel.create({name: user.login,author: user._id})

            const token = generateToken(user._id)

            if (user && newChannel) {
                return res.status(200).json({
                    success: true,
                    message: 'User was registered! New channel was created!',    
                    user,
                    channel: newChannel,
                    token
                })
            }
            
        } catch (error) {
            console.error(error)

            return res.status(404).json({
                message: error
            })
        }
    }

    async getAllUsers(req,res) {
        try {
            const users = await User.find({})

            if(users) return res.status(200).json({users})
            
        } catch (error) {
            console.log(error)

            return res.status(404).json({
                message: error
            })
        }
    }

    async getMe(req,res) {
        try {
            const newToken = generateToken(req.user._id)
            const myChannel = await Channel.findOne({author: req.user._id})

            if(!myChannel) res.status(404).json({message: 'Ваш персональный канал не найдет'})

            res.status(200).json({
                success: true,
                message: 'New token generated!',
                user: req.user,
                token: newToken,
                channel: myChannel
            })
        } catch (error) {
            console.log(error)

            return res.status(404).json({
                message: error
            })
        }
    }

    async addWatchLater(req,res) {
        try {
            const { id } = req.params

            const user = await User.findById(req.user._id)

            user.watchLater.push(id)
            
            const updatedUser = user.save()

            if (updatedUser) return res.status(200).json({
                success: true,
                message: 'Видео добавлено в список смотреть позже!',
                watchlater: updatedUser.watchLater
            })
        } catch (e) {
            console.log('Не удалось добавить видео в список смотреть позже',e.message)

            return res.status(404).json({
                message: e.message
            })
        }
    }

    async getWatchLater(req,res) {
        try {
            const user = await User.findById(req.user._id).populate({path: 'watchLater', select: '-description -sourceUrl -views -__v -updatedAt -createdAt -channel'})
            if (!user) return res.status(500).json({message: 'Не удалось получить пользователя!'})

            return res.status(200).json({
                success: true,
                message: 'Удалось получить список смотреть позже!',
                list: user.watchLater
            })
        } catch (e) {
            console.log('Не удалось получить список смотреть позже',e.message)

            return res.status(404).json({
                message: e.message
            })
        }
    }

    async removeWatchLater(req,res) {
        try {
            const { id } = req.params
            const user = await User.findById(req.user._id)

            if (!user) return res.status(500).json({
                message: 'Не удалось найти пользователя',
                success: false
            })
            
            user.watchLater = user.watchLater.filter(video => video != id)
            
            const updatedUser = user.save()
            if (updatedUser) return res.status(200).json({
                message: 'Видео успешно удалено!',
                success: true,
                list: user.watchLater
            })

        } catch (e) {
            console.log('Не удалось удалить видео из списока смотреть позже',e.message)

            return res.status(404).json({
                message: e.message,
                success: false
            })
        }
    }
}


export default new UserController()