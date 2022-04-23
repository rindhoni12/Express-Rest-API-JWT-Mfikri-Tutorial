import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import db from './config/database.js'
import router from './routes/indexRoute.js'
// import Users from './models/userModel.js'

dotenv.config()
const app = express()

try {
    await db.authenticate()
    console.log('DB Connected...')
    // await Users.sync()
} catch (error) {
    console.error(error)
}

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use(cookieParser())
app.use(express.json())
app.use(router)

app.listen(5000, () => { console.log('Server running on port 5000') })