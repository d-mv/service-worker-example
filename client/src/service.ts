import axios from 'axios'

const publicKey =
  'BDobnNEiUBJkBUeIYLW3JDyKsCQRHPLYnVqr11XJl5DWPgZhSF0q5FDygK1YEjBTOTiN_gLyEbMWnRVAvKfsi78'

const urlBase64ToUint8Array = (key: string): Uint8Array => {
  const padding = '='.repeat((4 - (key.length % 4)) % 4)
  const base64 = (key + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray: Uint8Array = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// main function
export const run = async (): Promise<boolean> => {
  // check if serviceWorker functionality is supporter by the browser(navigator)
  if ('serviceWorker' in navigator) {
    try {
      console.log('Registering service worker')
      // registering script 'worker.js' as processor for notifications (as service worker)
      const registration = await navigator.serviceWorker.register(
        // PUBLIC_URL => 'public' folder
        `${process.env.PUBLIC_URL}/worker.js`,
        { scope: '/' }
      )
      //  unsubscribe from old subscription, should not be needed
      const current = await registration.pushManager.getSubscription()
      if (current) await current.unsubscribe()

      // make object for subscription
      const subObject = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      }
      // show object
      const subscription = await registration.pushManager.subscribe(subObject)
      console.log('Registered push')

      console.log('Sending push')
      // send request to server
      await axios.post(
        'http://localhost:3000/api/subscribe',
        subscription,
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      console.log('Sent push to server')
    } catch (e) {
      // display error from server
      console.log(e)
      if (e.response && e.response.data) console.log(e.response.data)
    }
    return true
  }
  return false
}

export const alert = async (): Promise<boolean> => {
  // get current service worker registration data
  const currentReg = await navigator.serviceWorker.getRegistration()
  // get subscription details
  const currentSub = currentReg
    ? await currentReg.pushManager.getSubscription()
    : ''
  // send request to server
  if (currentSub) {
    await axios.post('http://localhost:3000/api/alert', currentSub, {
      headers: {
        'content-type': 'application/json'
      }
    })
    return true
  }
  return false
}
