"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const dotEnv = dotenv_1.default.config();
const secret = process.env.SECRET;
const UserSchema = new mongoose_1.default.Schema({
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
const User = mongoose_1.default.model("User", UserSchema);
module.exports = User;
//# sourceMappingURL=user.model.js.map