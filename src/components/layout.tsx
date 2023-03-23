import React, { useEffect } from 'react'
import Nav from './navbar'
import Footer from './footer'
import { getAuth } from 'firebase/auth'; // Firebase v9+
import { getFirestore } from 'firebase/firestore';
import {useAnalytics} from 'reactfire';
import Providers from './providers'
export default function Layout({children}:{children:JSX.Element|JSX.Element[]}) {

     

    return (
          <Providers>
           <Nav/>
           <main>
            {children}
           </main>
           <Footer/>
           </Providers>
    )
}
