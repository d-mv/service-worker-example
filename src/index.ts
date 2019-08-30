import express from "express";
import path from "path";
import cors from "cors";
import "./db_connect";
// routes
import routes from "./routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/", routes);

// * React
//Static file declaration
app.use(express.static(path.join(__dirname, "../client/build/")));
//build mode
app.get("/index.html", (req: any, res: any) => {
  res.sendFile(path.join(__dirname + "../client/build/index.html"));
});
// * end of React

app.listen(port, () => {
  console.log("server is up on " + port);
});
