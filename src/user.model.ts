import mongoose from "mongoose";
import dotenv from "dotenv";

const dotEnv = dotenv.config();
const secret: any = process.env.SECRET;

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
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
