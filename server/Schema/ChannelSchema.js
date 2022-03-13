import mongoose from 'mongoose'



const ChannelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 25,
        unique: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    avatar: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF8UCoYjmWy6v-elC5Irwhc9poLsTmrzEOeQ&usqp=CAU'
    }
})


export default mongoose.model('Channel', ChannelSchema)