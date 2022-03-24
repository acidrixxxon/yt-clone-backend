import { decodeToken } from "./jwt.js"
import User from './../Schema/UserSchema.js'

const protect = async (req,res,next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            if (!token) return res.status(401).json({message: 'No token!'})
            
            const decode = decodeToken(token)
            if (!decode) return res.status(500).json({message: 'Wrong data!'})

            const user = await User.findById(decode.id).populate({path: 'subscriptions',select: '-__v -subscribers -author'}).select('-password -__v')

            req.user = user

            next()
        } catch (error) {
            console.error(error.message)
            throw new Error(error.message)
        }
    } else {
        console.error('Запрос без токена!')
        
        return res.status(401).json({
            success: false,
            message: 'No token!'
        })
    }
}

export default protect