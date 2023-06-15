import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import React, { useEffect } from 'react'
import firebase from '../firebase/fbconfig'
import { getAnalytics, logEvent } from 'firebase/analytics'

export default function SignIn() {
    var uiConfig = {
        signInSuccessUrl: `${process.env.REDIRECT_AFTER_SIGN_IN}`,
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            {
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // Required to enable ID token credentials for this provider.
                clientId:
                    '680632296814-ohtr1ftg58rpt6o8aunod32i4apcivjn.apps.googleusercontent.com',
                customParameters: {
                    // Forces account selection even when one account
                    // is available.
                    prompt: 'select_account',
                },
            },
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],

        callbacks: {
            signInSuccessWithAuthResult: function (
                authResult: any,
                redirectURL: any
            ) {
                const analytics = getAnalytics()
                console.log(authResult)
                if (!authResult.additionalUserInfo.isNewUser)
                    logEvent(analytics, 'login', {
                        method: authResult.additionalUserInfo.providerId,
                    })

                if (authResult.additionalUserInfo.isNewUser)
                    logEvent(analytics, 'sign_up', {
                        method: authResult.additionalUserInfo.providerId,
                    })

                console.log(authResult)
                return true
            },
        },
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        //signInFlow: 'popup',
        //signInFlow: 'popup',
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function () {
            window.location.assign('<your-privacy-policy-url>')
        },
        credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
    }

    var ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(firebase.auth())
    useEffect(() => {
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig)
    }, [])
    // Initialize the FirebaseUI Widget using Firebase.

    return <div id="firebaseui-auth-container" style={{ zIndex: 500 }}></div>
}
