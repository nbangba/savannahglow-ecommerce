import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import React,{useEffect} from 'react'
import firebase from '../firebase/fbconfig';
  
  export default function Reauth({type,change,setSuccess}) {
    var uiConfig = {
        callbacks:{
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                var user = authResult.user;
                var credential = authResult.credential;
                var isNewUser = authResult.additionalUserInfo.isNewUser;
                var providerId = authResult.additionalUserInfo.providerId;
                var operationType = authResult.operationType;
                // Do something with the returned AuthResult.
                // Return type determines whether we continue the redirect
                // automatically or whether we leave that to developer to handle.
                return true;
              },
        },
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            customParameters: {
              // Forces password re-entry.
              auth_type: 'reauthenticate'
            }
          },
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            
            customParameters: {
              // Forces password re-entry.
              auth_type: 'reauthenticate'
            }
          },
          
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
          window.location.assign('<your-privacy-policy-url>');
        }
      };
      
      useEffect(() => {
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        // The start method will wait until the DOM is loaded.
        
        ui.start('#firebaseui-auth-container', uiConfig);
        
        return ()=> ui.delete().then(()=>console.log('auth instance deleted'))
      }, [])
      // Initialize the FirebaseUI Widget using Firebase.
      
      return (
          <div id='firebaseui-auth-container' style={{zIndex:500}}>
              
          </div>
      )
  }
  