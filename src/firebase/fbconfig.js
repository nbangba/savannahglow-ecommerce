import firebase from 'firebase/compat/app';


  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  //I am still keeping thisfor firebase ui in signin.js
  var firebaseConfig = {
    apiKey: `AIzaSyBriNCuhss3BduhnE7R7zAuqxSGFez3vs8`,
    authDomain: "savannah-glow.firebaseapp.com",
    projectId: "savannah-glow",
    storageBucket: "savannah-glow.appspot.com",
    messagingSenderId: "199451664618",
    appId: "1:199451664618:web:d6d17b013c804b9b15b793",
    measurementId: "G-6432EF2LT9"
  };
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
 }

  export default firebase
