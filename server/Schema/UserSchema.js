import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        maxlength: 30,
        required: true,
        unique: true
    },
    email: {
        type: String,
        maxlength: 40,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }],
    avatar: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxmV8iY2AoANKaZio717sqf4VzHhluWrAeYw&usqp=CAU'
    },
    watchLater: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }]
})

export default mongoose.model('User',userSchema)