import mongoose from 'mongoose'



const HistorySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }]
},{
    versionKey: false
})


export default mongoose.model('History',HistorySchema)