import "dotenv/config"
import express, { Application } from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import routes from './router'

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/auth', routes.authRoutes)
app.use('/games', routes.userRoutes)

const start = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`, 
        {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify: false,
            useCreateIndex: true
        })

        app.listen(process.env.APP_PORT, () =>
            console.log(`App started at http://localhost:${process.env.APP_PORT || 5000}`
        ))
    }
    catch (e) {
        console.log(e)
    }
}

start()