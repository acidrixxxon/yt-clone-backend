import express from 'express'
import HistoryCtrl from '../Controller/historyController.js'
import protect from './../utils/authMiddleware.js'
const router = express.Router()


router.get('/:id/add',protect,HistoryCtrl.addToHistory)
router.get('/gethistory',protect,HistoryCtrl.getHistory)
router.get('/:id/remove',protect,HistoryCtrl.removeFromHistory)
router.get('/clear',protect,HistoryCtrl.clearHistory)

export default router
