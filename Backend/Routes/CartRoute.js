import express from 'express'
import UserPrevent from '../Middleware/UserPrevent.js'
import Cart from '../Model/CartModel.js'

const router = express.Router()

router.post('/add-cart/', UserPrevent, async (request, response) => {
  try {
    const userId = request.user.userId

    const { productId, quantity = 1 } = request.body || {}

    if (!productId) {
      return response.status(400).json({
        success: false,
        message: 'productId is required'
      })
    }

    let userCart = await Cart.findOne({ userId })

    if (!userCart) {
      // create new cart
      userCart = await Cart.create({
        userId,
        items: [{ productId, quantity }]
      })
    } else {
      // check if product already exists
      const productIndex = userCart.items.findIndex(item => item.productId.toString() === productId)

      if (productIndex > -1) {
        userCart.items[productIndex].quantity += quantity
      } else {
        userCart.items.push({ productId, quantity })
      }

      await userCart.save()
    }

    response.json({
      success: true,
      message: 'Added to cart',
      cart: userCart
    })
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message
    })
  }
})

router.get('/my-cart', UserPrevent, async (request, response) => {
  try {
    const userId = request.user.userId

    let cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'productName price images category stock'
    })

    if (!cart) {
      return response.json({
        items: [],
        totalPrice: 0
      })
    }

    cart.items = cart.items.filter(item => item.productId !== null)

    // calculate total
    let totalPrice = 0
    cart.items.forEach(item => {
      totalPrice += item.productId.price * item.quantity
    })

    await cart.save()

    response.json({
      cartId: cart._id,
      items: cart.items,
      totalPrice
    })
  } catch (error) {
    response.status(500).json({
      message: error.message
    })
  }
})

router.delete('/remove/:productId', UserPrevent, async (request, response) => {
  try {
    const userId = request.user.userId
    const productId = request.params.productId

    const cart = await Cart.findOneAndUpdate(
      { userId },
      {
        $pull: {
          items: { productId }
        }
      },
      { new: true }
    ).populate({
      path: 'items.productId',
      select: 'productName price images category'
    })

    if (!cart) {
      return response.status(404).json({
        message: 'Cart not found'
      })
    }

    let totalPrice = 0
    cart.items.forEach(item => {
      if (item.productId) {
        totalPrice += item.productId.price * item.quantity
      }
    })

    response.json({
      message: 'Product removed from cart',
      cartId: cart._id,
      items: cart.items,
      totalPrice
    })
  } catch (error) {
    response.status(500).json({
      message: error.message
    })
  }
})

export default router
