import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const dbUrl: string =
  process.env.MONGO_URL || 'mongodb://localhost:27017/secure'

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('connected to database')
  })
  .catch(() => {
    console.log('failed to connect to database')
  })
