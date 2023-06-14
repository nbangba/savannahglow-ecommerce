import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/analytics'
import 'firebase/compat/functions'
import 'firebase/compat/messaging'
import 'firebase/compat/app'
import 'firebase/compat/performance'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//I am still keeping thisfor firebase ui in signin.js
const firebaseConfig = {
    apiKey: `${process.env.FIREBASE_API_KEY}`,

    authDomain: 'savannahglow-65324.firebaseapp.com',

    projectId: 'savannahglow-65324',

    storageBucket: 'savannahglow-65324.appspot.com',

    messagingSenderId: '680632296814',

    appId: '1:680632296814:web:fcba6176851308536f8d7f',

    measurementId: 'G-CBTTGN43EM',
}

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

const analytics = firebase.analytics()
export default firebase
