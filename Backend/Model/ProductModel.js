import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Enter the Product Name'],
      trim: true
    },
    price: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      required: [true, 'Enter the Product description ']
    },
    image: {
      type: String,
      required: [true, 'Upload the image']
    },

    stock: {
      type: Number,
      required: [true, 'Enter the Minmun 1 quantity'],
      min: 1
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)
