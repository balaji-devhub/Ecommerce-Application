import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

// importing model
import Product from '../Model/ProductModel.js'
import Admin from '../Model/AdminModel.js'
import LoggerPrevent from '../Middleware/LoggerPrevent.js'

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

    const payload = {
      email: existingAdmin.email,
      role: existingAdmin.role,
      adminId: existingAdmin._id
    }
    const jwt_token = await jwt.sign(payload, process.env.JWT_TOKEN)

    res.status(200).json({
      message: 'Admin login successful',
      adminEmail: email,
      jwt_token
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
    const { adminName, email, shopName, location, password, adminProducts } = req.body

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
      adminEmail: email,
      adminProduct: adminProducts
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

// add new Product
router.post('/new/product', LoggerPrevent, async (request, response) => {
  try {
    const adminId = request.user.adminId

    const productDetails = request.body

    const admin = await Admin.findById(adminId)
    if (!admin) {
      return response.status(401).json({ message: 'Unauthorized' })
    }

    const product = await Product.create({
      ...productDetails,
      adminId
    })

    return response.status(201).json({
      message: 'Product added successfully',
      productId: product._id
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message
    })
  }
})

// get all Products
router.get('/product/all', LoggerPrevent, async (request, response) => {
  try {
    const adminId = request.user.adminId

    const allProducts = await Product.find({ adminId })

    return response.json({
      product_count: allProducts.length,
      products: allProducts
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message
    })
  }
})

// delete Product
router.delete('/product-del/:id', LoggerPrevent, async (request, response) => {
  try {
    const adminId = request.user.adminId
    const productId = request.params.id

    const product = await Product.findOneAndDelete({
      _id: productId,
      adminId: adminId
    })

    if (!product) {
      return response.status(404).json({
        message: 'Product not found or not authorized'
      })
    }

    return response.json({
      message: 'Product deleted successfully',
      productId: product._id
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message
    })
  }
})

// update Product details
router.put('/prod-update/:id', LoggerPrevent, async (request, response) => {
  try {
    const adminId = request.user.adminId
    const productId = request.params.id

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, adminId },
      { $set: request.body },
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return response.status(404).json({
        success: false,
        message: 'Product not found or unauthorized'
      })
    }

    response.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    })
  } catch (error) {
    response.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    })
  }
})

export default router
