import mongoose from 'mongoose'

const Cart = mongoose.Schema({
  userId: {
    types: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },
  CartItems: [
    {
      ProductId: {
        types: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        types: Number,
        default: 1,
        min: 1,
        required: true
      }
    }
  ]
})

export default mongoose.model('Cart', Cart)
