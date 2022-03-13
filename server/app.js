import express from 'express'
import dotenv from 'dotenv'
import videoRouter from './routes/videoRouter.js'
import userRouter from './routes/userRouter.js'
import channelRouter from './routes/channelRouter.js'
import searchRouter from './routes/searchRouter.js'
import historyRouter from './routes/historyRouter.js'
import fileupload from 'express-fileupload'
import mongoose from 'mongoose'
import cors from 'cors'
dotenv.config()

const dbConnect = async () => {
    try {
        mongoose.connect('mongodb+srv://Zen:123@cluster0.wozk2.mongodb.net/yt-clone?retryWrites=true&w=majority',{
            useNewUrlParser: true,
        }).then(res => console.log('DB was connected!'))
    } catch (error) {
        console.log(error)
    }
}

const app = express()
const PORT = 5001 || process.env.PORT


app.use(cors())
app.use(express.json())
app.use(fileupload({
    useTempFiles : true
}))
app.use(express.urlencoded({extended: true}))
app.use('/video',videoRouter)
app.use('/user',userRouter)
app.use('/channel/',channelRouter)
app.use('/search',searchRouter)
app.use('/history',historyRouter)

app.listen(PORT, () => {
    try {
        dbConnect()
        console.log('SERVER HAS BEEN STARTED!')
    } catch (error) {
        console.log(error)
    }
})