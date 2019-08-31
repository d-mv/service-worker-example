import mongoose from 'mongoose'

export type UserType = {
  subscriptionObject: {
    endpoint: string;
    expirationTime: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

const UserSchema = new mongoose.Schema({
  subscriptionObject: {
    endpoint: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    expirationTime: { type: String, trim: true },
    keys: {
      p256dh: { type: String, trim: true },
      auth: { type: String, trim: true }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model('User', UserSchema)

export default User
