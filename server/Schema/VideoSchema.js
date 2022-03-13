import mongoose from 'mongoose'

const VideoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100,
        minLength: 10
    },
    description: {
        type: String,
        required: true,
        maxLength: 1000,
        minLength: 50
    },
    sourceUrl: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: 'https://i.ytimg.com/vi/o43iiH4kGqg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLA8W-YabRXeIR_OX2HWheD0YtMOFQ'
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    },
    views: {
        type: Number,
        default: 0,
    },
    duration: {
        type: String,
        default: '5:55'
    }
},{
    timestamps: true 
})

export default mongoose.model('Video', VideoSchema)