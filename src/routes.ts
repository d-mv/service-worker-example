import dotenv from "dotenv";
const express = require("express");
const webpush = require("web-push");

const router = new express.Router();
const User = require("./user.model");

dotenv.config();

// from .env
const publicKey = process.env.PUBLIC_PUSH_KEY;
const privateKey = process.env.PRIVATE_PUSH_KEY;

router.post("/subscribe", async (req: any, res: any) => {
  // console.log(req.body);
  const newUser = new User({
    subscriptionObject: req.body
  });
  try {
    // save new user
    await newUser.save();
    // if not saved - throw error
    if (!newUser) throw new Error("User not saved");
    // otherwise - respond with OK
    res.status(201);
  } catch (e) {
    // if error - console and respond with error
    console.log(e.errmsg);
    res.status(400).send(e.errmsg);
  }

  // TODO: move below to different endpoint
  // set auth settings
  webpush.setVapidDetails("mailto:mail@mail.com", publicKey, privateKey);
  // get users, except for current
  // after move to other endpoint, change newUser._id to endpoint address
  const users = await User.find({
    _id: {
      $ne: newUser._id
    }
  });
  // prepare message
  const message = JSON.stringify({
    title: "hi from back"
  });
  // send push to every user from array
  users.map(async (el: any) => {
    try {
      const notify = await webpush.sendNotification(
        el.subscriptionObject,
        message
      );
      console.log(notify);
    } catch (e) {
      console.error(e);
    }
  });
});

export default router;
