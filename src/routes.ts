import dotenv from 'dotenv'
import express, { Router } from 'express'
import webpush from 'web-push'
import User, { UserType } from './user.model'
import { Document } from 'mongoose'

const router: Router = express.Router()
dotenv.config()

// from .env
const publicKey = process.env.PUBLIC_PUSH_KEY || ''
const privateKey = process.env.PRIVATE_PUSH_KEY || ''

router.post('/subscribe', async (req: any, res: any) => {
  const newUser = new User({
    subscriptionObject: req.body
  })
  try {
    // save new user
    await newUser.save()
    // if not saved - throw error
    if (!newUser) throw new Error('User not saved')
    // otherwise - respond with OK
    res.status(201)
  } catch (e) {
    // if error - console and respond with error
    console.log(e.errmsg)
    res.status(400).send(e.errmsg)
  }
})
router.post('/alert', async (req: any, res: any) => {
  // endPoint of current user
  const { endpoint } = req.body
  // get users, except for current
  const users: Document[] = await User.find({
    'subscriptionObject.endpoint': {
      $ne: endpoint
    }
  })
  // set auth settings
  webpush.setVapidDetails('mailto:mail@mail.com', publicKey, privateKey)

  // prepare message
  const message = JSON.stringify({
    title: 'ALERT',
    body: 'Someone needs your help now!!!!',
    icon: 'https://tpmbc.com/wp-content/uploads/2018/02/TrailCondition.png'
  })
  // send push to every user from array
  users.map(async (el: any) => {
    try {
      const notify = await webpush.sendNotification(
        el.subscriptionObject,
        message
      )
      console.log(notify)
    } catch (e) {
      console.error(e)
    }
  })
})

export default router
