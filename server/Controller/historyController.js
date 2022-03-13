import History from './../Schema/HistorySchema.js'


class HistoryController {

    async addToHistory (req,res) {
        try {
            const { id } = req.params
            const existHistory = await History.findOne({user: req.user._id})

            if (!existHistory) {
                const videoInHistory = await History.create({user: req.user._id,history: id})
                return res.status(200).json({
                    success: true,
                    message: 'История создана,видео добавлено успешно!',
                    history: videoInHistory
                })
            }

            existHistory.history.push(id)
            existHistory.save()

            return res.status(200).json({
                success: true,
                message: 'Видео добавлено в историю',
                history: existHistory
            })

        } catch (e) {
            console.log(e.message)
            throw new Error('Не удалось добавить видео в историю!')
        }
    }

    async getHistory (req,res) {
        try {
            const history = await History.findOne(req.user._id).populate({path: 'history',select: '-__v -updatedAt',populate: {path: 'channel',select: '-__v -subscribers -avatar -author'}})

            return res.status(200).json({
                history
            })
        } catch (e) {
            console.log(e.message)
            throw new Error('Не удалось получить историю')
        }
    }

    async removeFromHistory(req,res) {
        try {
            const { id } = req.params

            const history = await History.findOne(req.user._id)

            if (!history) return res.status(404).json({
                success: false,
                message: 'Не удалось найти историю!'
            })

            history.history = history.history.filter(item => item != id)
            const updatedhistory = await history.save()

            return res.status(200).json({
                success: true,
                message: 'Видео удалено успешно',
                history
            })
        } catch (e) {
            console.error(e.message)
            throw new Error('Не удалось удалить видео из истории')
        }
    }

    async clearHistory(req,res) {
        try {
            const history = await History.findOne(req.user._id)

            history.history = []

            const updatedHistory = await history.save()

            if ( updatedHistory && updatedHistory.history.length == 0) return res.status(200).json({
                success: true,
                message: 'История очищена!',
                history: updatedHistory
            })
        } catch (e) {
            console.log(e.message)
            throw new Error('Не удалось очистить историю')
        }
    }
}



export default new HistoryController()