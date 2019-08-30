"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
require("./db_connect");
const routes_1 = __importDefault(require("./routes"));
const app = express_1.default();
const port = process.env.PORT || 3000;
app.use(cors_1.default());
app.use(express_1.default.json());
app.use("/api/", routes_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "../client/build/")));
app.get("/index.html", (req, res) => {
    res.sendFile(path_1.default.join(__dirname + "../client/build/index.html"));
});
app.listen(port, () => {
    console.log("server is up on " + port);
});
//# sourceMappingURL=index.js.map