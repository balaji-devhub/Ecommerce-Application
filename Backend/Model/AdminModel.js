import mongoose from 'mongoose'

const AdminSchema = mongoose.Schema(
  {
    adminName: {
      type: String,
      required: [true, 'Please enter the Username']
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^\S+@\S+\.\S+$/.test(value)
        },
        message: 'Invalid email format'
      }
    },
    shopName: {
      type: String,
      required: [true, 'Please enter the Shop name']
    },
    location: {
      type: String,
      required: [true, 'Please enter the Location']
    },
    password: {
      type: String,
      required: [true, 'Enter the Password'],
      trim: true
    },
    role: {
      type: String,
      default: 'Admin'
    },
    adminProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ]
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Admin', AdminSchema)
