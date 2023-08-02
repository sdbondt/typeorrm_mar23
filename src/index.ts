import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimiter from 'express-rate-limit'
const xss = require('xss-clean')
import { AppDataSource } from "./data-source"
import authRouter from './routes/authRoutes'
import postRouter from './routes/postRoutes'
import commentRouter from './routes/commentRoutes'
import notFoundHandler from './errorhandlers/notFoundHandler'
import { errorHandler } from './errorhandlers/errorHandler'
import { auth } from './middleware/auth'
dotenv.config()

AppDataSource.initialize().then(() => {
    console.log('Data source initialized.')
}).catch(error => console.log(error))

const app = express()
const PORT = parseInt(process.env.PORT as string) || 3000

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(xss())
app.use(morgan('dev'))
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10000
}))

app.use('/api/auth', authRouter)
app.use('/api/posts', auth, postRouter)
app.use('/api/comments', auth, commentRouter)

app.use(errorHandler)
app.use(notFoundHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
