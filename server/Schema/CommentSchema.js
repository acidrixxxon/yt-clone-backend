import mongoose from 'mongoose'


const CommentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }
},{
    timestamps: true
})


export default mongoose.model('Comment',CommentSchema)