"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/secure';
mongoose_1.default
    .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(() => {
    console.log('connected to database');
})
    .catch(() => {
    console.log('failed to connect to database');
});
//# sourceMappingURL=db_connect.js.map