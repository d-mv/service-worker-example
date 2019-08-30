import axios from "axios";

// public key should be from .env
const oldKey =
  "BOynOrGhgkj8Bfk4hsFENAQYbnqqLSigUUkCNaBsAmNuH6U9EWywR1JIdxBVQOPDbIuTaj0tVAQbczNLkC5zftw";
const publicKey =
  "BDobnNEiUBJkBUeIYLW3JDyKsCQRHPLYnVqr11XJl5DWPgZhSF0q5FDygK1YEjBTOTiN_gLyEbMWnRVAvKfsi78";

const urlBase64ToUint8Array = (key: string) => {
  const padding = "=".repeat((4 - (key.length % 4)) % 4);
  const base64 = (key + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// const vapidPublicKey = "<Your Public Key from generateVAPIDKeys()>";
// const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

// main function
export const run = async () => {
  // check if serviceWorker functionality is supporter by the browser(navigator)
  if ("serviceWorker" in navigator) {
    try {
      console.log("Registering service worker");
      // registering script 'worker.js' as processor for notifications (as service worker)
      const registration = await navigator.serviceWorker.register(
        // PUBLIC_URL => 'public' folder
        `${process.env.PUBLIC_URL}/worker.js`,
        { scope: "/" }
      );
      console.log("Registered service worker");
      console.log("Registering push");
      const current = await registration.pushManager.getSubscription();

      if (current) {
        const remove = await current.unsubscribe();
        console.log(remove);
      }
      console.log(current);

      const subObject = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      };
      console.log(subObject)
      const subscription = await registration.pushManager.subscribe(subObject);
      console.log("Registered push");

      console.log("Sending push");
      // send request to server
      await axios.post("http://localhost:3000/api/subscribe", subscription, {
        headers: {
          "content-type": "application/json"
        }
      });
      console.log("Sent push to server");
    } catch (e) {
      // display error from server
      console.log(e);
      console.log(e.response.data);
    }
  }
};

// Boilerplate borrowed from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
// function urlBase64ToUint8Array(base64String: any) {
//   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding)
//     .replace(/\-/g, "+")
//     .replace(/_/g, "/");

//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }
