"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const web_push_1 = __importDefault(require("web-push"));
const user_model_1 = __importDefault(require("./user.model"));
const router = express_1.default.Router();
dotenv_1.default.config();
const publicKey = process.env.PUBLIC_PUSH_KEY || '';
const privateKey = process.env.PRIVATE_PUSH_KEY || '';
router.post('/subscribe', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new user_model_1.default({
        subscriptionObject: req.body
    });
    try {
        yield newUser.save();
        if (!newUser)
            throw new Error('User not saved');
        res.status(201);
    }
    catch (e) {
        console.log(e.errmsg);
        res.status(400).send(e.errmsg);
    }
}));
router.post('/alert', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { endpoint } = req.body;
    const users = yield user_model_1.default.find({
        'subscriptionObject.endpoint': {
            $ne: endpoint
        }
    });
    web_push_1.default.setVapidDetails('mailto:mail@mail.com', publicKey, privateKey);
    const message = JSON.stringify({
        title: 'ALERT',
        body: 'Someone needs your help now!!!!',
        icon: 'https://tpmbc.com/wp-content/uploads/2018/02/TrailCondition.png'
    });
    users.map((el) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const notify = yield web_push_1.default.sendNotification(el.subscriptionObject, message);
            console.log(notify);
        }
        catch (e) {
            console.error(e);
        }
    }));
}));
exports.default = router;
//# sourceMappingURL=routes.js.map