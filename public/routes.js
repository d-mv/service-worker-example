"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express = require("express");
const webpush = require("web-push");
const router = new express.Router();
const User = require("./user.model");
dotenv_1.default.config();
const publicKey = process.env.PUBLIC_PUSH_KEY;
const privateKey = process.env.PRIVATE_PUSH_KEY;
router.post("/subscribe", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const newUser = new User({
        subscriptionObject: req.body
    });
    try {
        yield newUser.save();
        if (!newUser)
            throw new Error("User not saved");
        res.status(201);
    }
    catch (e) {
        console.log(e.errmsg);
        res.status(400).send(e.errmsg);
    }
    webpush.setVapidDetails("mailto:rnd1prsn@gmail.com", publicKey, privateKey);
    const users = yield User.find({
        _id: {
            $ne: newUser._id
        }
    });
    const payload = JSON.stringify({
        title: "hi from back"
    });
    users.map((el) => __awaiter(this, void 0, void 0, function* () {
        try {
            const notify = yield webpush.sendNotification(el.subscriptionObject, payload);
            console.log(notify);
        }
        catch (e) {
            console.error(e);
        }
    }));
}));
exports.default = router;
//# sourceMappingURL=routes.js.map