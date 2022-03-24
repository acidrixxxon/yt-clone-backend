
import Comment from '../Schema/CommentSchema.js'
import Video from '../Schema/VideoSchema.js'


class CommentController {


    async create(req,res) {
        const { text } = req.body
        const { id } = req.params
    
        const video = await Video.findById(id)
        if (!video) return res.status(404).json({message: 'Видео не найдено',success: false})
    
        const newComment = await Comment.create({
            author: req.user._id,
            text,
            video: id
        })
        if (!newComment) return res.status(500).json({success: false,message: 'Не удалось создрать комментарий'})
    
        video.comments.push(newComment._id)
        await video.save()
    
        const comment = await Comment.findById(newComment._id).select('-__v -updatedAt').populate({path: 'author',select: '_id login avatar'})
        return res.status(200).json({
            message: 'Вы успешно добавили комментарий к видео!',
            success: true,
            comment
        })
    }

    async deleteComment(req,res) {
        try {
            const { id } = req.params
            const { commentId } = req.body

            const video = await Video.findById(id)
            video.comments = video.comments.filter(item => item != commentId)

            const resultVideo = await video.save()

            const resultComment = await Comment.deleteOne({_id: commentId})

            if (!resultVideo.comments.find(item => item == id) && resultComment.deletedCount == 1)  return res.status(200).json({
                message: 'Вы удалилил комментарий!',
                success: true
            })
        } catch (e) {
            console.log(e)
            return res.status(500).json(e.message)
        }
    }
}


export default new CommentController()