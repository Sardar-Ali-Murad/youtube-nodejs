import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'
import fileUpload from "express-fileupload"

import connectDB from './db/connect.js'
import Auth from "./routes/AuthRoute.js"
import Posts from "./routes/PostRoutes.js"
// const cloudinary = require('cloudinary').v2
import Authenticate from "./middleware/auth.js"

import cloudinary from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});



import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'
// import Auth from "../routes/AuthRoute.js"


if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1/auth",Auth)
app.use("/api/v1/post",Authenticate,Posts)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
