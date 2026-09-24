import exp from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import {eventApp} from './APIs/eventAPI.js'
import {userApp} from './APIs/userAPI.js'
import {registrationApp} from './APIs/registrationAPI.js'

const app = exp()

app.use(exp.json())
app.use(cookieParser())

app.use("/user-api", userApp)
app.use("/event-api", eventApp)
app.use("/registration-api", registrationApp)

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Campus Event Management API is running"
    })
})

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected successfully")

    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
})
.catch((err) => {
    console.log("MongoDB connection failed")
    console.log(err)
})