import express from 'express'
import UserPrevent from '../Middleware/UserPrevent.js'

const router = express.Router()

// add product to the Cart
router.post('/add-cart/', UserPrevent, async (request, response) => {
  const userId = request.user.email
})
