import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import Route from './routes/index.js'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
//import morgan from 'morgan'
import path from 'path'

const __dirname = path.resolve();


dotenv.config({ path: './config.env' })

const app = express()


app.use(cors())
app.use(express.json())
app.use(cookieParser())
//app.use(morgan('dev'))


app.use(express.json({ limit: '100mb', extended: true }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))



app.use(Route)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))//upload folder for images

//database

const CONNECTION_DB = 'mongodb+srv://wolf9021:wolf9021@cluster0.fgymn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'


const PORT = process.env.PORT || 4000

mongoose.connect(CONNECTION_DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }).then(app.listen(PORT, () => {
    console.log(`server is running on PORT: ${PORT}`)
}))
