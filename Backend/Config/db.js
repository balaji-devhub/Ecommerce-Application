import { response } from 'express'
import mongoose from 'mongoose'

const DbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Db connected Successfully')
  } catch (error) {
    console.log(error.message)
    response.send(error.message)
    process.exit(1)
  }
}

export default DbConnection
