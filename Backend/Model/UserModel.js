import mongoose from 'mongoose'

const UserSchema = mongoose.Schema(
  {
    name: {
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
    password: {
      type: String,
      required: [true, 'Enter the Password'],
      trim: true
    },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number']
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('User', UserSchema)
