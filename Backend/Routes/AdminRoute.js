import express from 'express'
import Admin from '../Model/AdminModel.js'
import bcrypt from 'bcryptjs'
const router = express.Router()

// login Admin
router.post('/login/', async (req, res) => {
  try {
    const { email, password } = req.body

    const existingAdmin = await Admin.findOne({ email })
    if (!existingAdmin) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const passwordCheck = await bcrypt.compare(password, existingAdmin.password)

    if (!passwordCheck) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    res.status(200).json({
      message: 'Admin login successful'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

// add new Admin
router.post('/new/', async (req, res) => {
  try {
    const { adminName, email, shopName, location, password } = req.body

    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return res.status(409).json({
        message: 'Admin already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await Admin.create({
      adminName,
      email,
      shopName,
      location,
      password: hashedPassword
    })

    res.status(201).json({
      message: 'Admin created successfully',
      adminName,
      adminEmail: email
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

export default router
