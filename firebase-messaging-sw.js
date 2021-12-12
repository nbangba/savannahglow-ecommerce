import { initializeApp } from "firebase/app";
import { getMessaging,onBackgroundMessage } from "firebase/messaging/sw";


var firebaseConfig = initializeApp({
    apiKey: `AIzaSyBriNCuhss3BduhnE7R7zAuqxSGFez3vs8`,
    authDomain: "savannah-glow.firebaseapp.com",
    projectId: "savannah-glow",
    storageBucket: "savannah-glow.appspot.com",
    messagingSenderId: "199451664618",
    appId: "1:199451664618:web:d6d17b013c804b9b15b793",
    measurementId: "G-6432EF2LT9"
  });
  

  const messaging = getMessaging(firebaseConfig)

  onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
  