import React from "react"
import { FirebaseAppProvider } from 'reactfire';
import Providers from "./src/components/providers";
// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => {

  var firebaseConfig = {
    apiKey: `AIzaSyBriNCuhss3BduhnE7R7zAuqxSGFez3vs8`,
    authDomain: "savannah-glow.firebaseapp.com",
    projectId: "savannah-glow",
    storageBucket: "savannah-glow.appspot.com",
    messagingSenderId: "199451664618",
    appId: "1:199451664618:web:d6d17b013c804b9b15b793",
    measurementId: "G-6432EF2LT9"
  };
  // Instantiating store in `wrapRootElement` handler ensures:
  //  - there is fresh store for each SSR page
  //  - it will be called only once in browser, when React mounts
  if (typeof window === "undefined") return <>{element}</>
  return <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense >
              
               {element} 
               
        </FirebaseAppProvider>
}