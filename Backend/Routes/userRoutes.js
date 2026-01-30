import express from 'express'
import User from '../Model/UserModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const router = express.Router()

// login User
router.post('/login/', async (request, response) => {
  try {
    const { email, password } = request.body

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      return response.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const passwordCheck = await bcrypt.compare(password, existingUser.password)

    if (!passwordCheck) {
      return response.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const userPayload = {
      userId: existingUser._id,
      email
    }

    //generate token
    const jwt_token = jwt.sign(userPayload, process.env.JWT_TOKEN)

    response.status(200).json({
      message: 'User login successfully',
      jwt_token
    })
  } catch (error) {
    response.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

// add new user
router.post('/new-user/', async (request, response) => {
  const user = request.body
  const exisitingUser = await User.findOne({ email: user.email })

  if (exisitingUser) {
    return response.status(409).json({
      message: 'User already exists'
    })
  }

  const hashedPassword = await bcrypt.hash(user.password, 12)

  await User.create({
    email: user.email,
    name: user.name,
    phone: user.phone,
    password: hashedPassword
  })

  response.status(200).json({
    message: 'User Created Successfully',
    userName: user.name,
    userEmail: user.email
  })
})

export default router
