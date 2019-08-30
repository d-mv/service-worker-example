import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const dbUrl: any = process.env.MONGO_URL;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("failed to connect to database");
  });
