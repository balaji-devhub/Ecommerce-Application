import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import dbConnection from './Config/db.js'
import UserRoute from './Routes/userRoutes.js'
import AdminRoute from './Routes/AdminRoute.js'
import CartRoute from './Routes/CartRoute.js'

const app = express()
app.use(express.json())
dotenv.config()

// cors gate backend ---> frontend
app.use(cors())

// mongodb initialize
dbConnection()

// route middleware
app.use('/user/', UserRoute, CartRoute)
app.use('/admin/', AdminRoute)

// server initialization
app.get('/process', (request, response) => {
  response.send('The server is Under control ')
})

app.listen(process.env.PORT, () => {
  console.log(`${process.env.NODE_ENV} Server Running on ${process.env.PORT}`)
})
