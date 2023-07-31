importScripts(
  "https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js",
)
importScripts(
  "https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js",
)

const firebaseConfig = {
  apiKey: "AIzaSyBFRNarqYsPUKBLjNm2qwvULSfd3aQgW2M",
  authDomain: "artinfo-c5248.firebaseapp.com",
  projectId: "artinfo-c5248",
  storageBucket: "artinfo-c5248.appspot.com",
  messagingSenderId: "1096388696027",
  appId: "1:1096388696027:web:fa6a7c8a54b62182d6f9fe",
  measurementId: "G-51D21Q695N",
}

const app = firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  )

  const notificationTitle = payload.data.title
  const notificationOptions = {
    body: payload.data.body,
    icon: "/img/logo.png",
    data: {
      // badge: 10,
      clickAction: payload.data.clickAction,
    },
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener("notificationclick", e => {
  const clickAction = e.notification.data.clickAction
  e.notification.close()
  e.waitUntil(self.clients.openWindow(clickAction))
})
