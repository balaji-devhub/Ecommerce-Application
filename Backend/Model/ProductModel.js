import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      default: 0
    },

    description: {
      type: String,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    stock: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)
