import dotenv from "dotenv";
const express = require("express");
const webpush = require("web-push");

const router = new express.Router();
const User = require("./user.model");

dotenv.config();

const publicKey = process.env.PUBLIC_PUSH_KEY;
const privateKey = process.env.PRIVATE_PUSH_KEY;

router.post("/subscribe", async (req: any, res: any) => {
  // console.log(req.body);
  const newUser = new User({
    subscriptionObject: req.body
  });
  try {
    await newUser.save();
    if (!newUser) throw new Error("User not saved");
    res.status(201);
  } catch (e) {
    console.log(e.errmsg);
    res.status(400).send(e.errmsg);
  }

  // Replace with your email
  webpush.setVapidDetails("mailto:rnd1prsn@gmail.com", publicKey, privateKey);

  const users = await User.find({
    _id: {
      $ne: newUser._id
    }
  });

  const payload = JSON.stringify({
    title: "hi from back"
  });

  users.map(async (el: any) => {
    try {
      const notify = await webpush.sendNotification(
        el.subscriptionObject,
        payload
      );
      console.log(notify);
    } catch (e) {
      console.error(e);
    }
  });

});

export default router;
