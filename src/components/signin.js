import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import React,{useEffect} from 'react'
import firebase from '../firebase/fbconfig';
import { getAnalytics, logEvent } from "firebase/analytics";

  export default function SignIn() {
    var uiConfig = {
        //signInSuccessUrl: 'http://localhost:8000/',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            // Required to enable ID token credentials for this provider.
            clientId: '199451664618-mjnu72rutr4dkjelklvuv9rvpci6tomg.apps.googleusercontent.com',
          },
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],

        callbacks:{
          'signInSuccessWithAuthResult': function(authResult) {
            const analytics = getAnalytics();
            if(!authResult.additionalUserInfo.isNewUser)
            logEvent(analytics,'login',{method:authResult.credential.providerId})
            
            if(authResult.additionalUserInfo.isNewUser)
            logEvent(analytics,'sign_up',{method:authResult.credential.providerId})

            console.log(authResult)
            return false;
          }
        },
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        //signInFlow: 'popup',
        
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
          window.location.assign('<your-privacy-policy-url>');
        },
        credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
      };
      
      var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
      useEffect(() => {
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);
      }, [])
      // Initialize the FirebaseUI Widget using Firebase.
      
      return (
          <div id='firebaseui-auth-container' style={{zIndex:500}}>
              
          </div>
      )
  }
  
  