import React from 'react'
import { FirebaseAppProvider } from 'reactfire'
// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => {
    const firebaseConfig = {
        apiKey: `AIzaSyDGHTzlA-Iq457SzfvDmbvb2QBTT79poc8`,

        authDomain: 'savannahglow-65324.firebaseapp.com',

        projectId: 'savannahglow-65324',

        storageBucket: 'savannahglow-65324.appspot.com',

        messagingSenderId: '680632296814',

        appId: '1:680632296814:web:fcba6176851308536f8d7f',

        measurementId: 'G-CBTTGN43EM',
    }

    // Instantiating store in `wrapRootElement` handler ensures:
    //  - there is fresh store for each SSR page
    //  - it will be called only once in browser, when React mounts
    if (typeof window === 'undefined') return <>{element}</>
    return (
        <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense>
            {element}
        </FirebaseAppProvider>
    )
}
