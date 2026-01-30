import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const LoggerPrevent = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token' })

  req.user = jwt.verify(token, process.env.JWT_TOKEN)
  next()
}

export default LoggerPrevent
