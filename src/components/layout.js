import React from 'react'
import Nav from './navbar'
import Footer from './footer'
import { getAuth } from 'firebase/auth'; // Firebase v9+
import { doc, getFirestore } from 'firebase/firestore';
import { FirestoreProvider, AuthProvider, useFirebaseApp ,SuspenseWithPerf} from 'reactfire';


export default function Layout({children}) {
    const auth = getAuth()
    const firestoreInstance = getFirestore(useFirebaseApp());
    return (
        <AuthProvider sdk={auth}>
            <FirestoreProvider sdk={firestoreInstance}>
           <Nav/>
           <main>
            {children}
           </main>
           <Footer/>
           </FirestoreProvider>
        </AuthProvider>
    )
}
