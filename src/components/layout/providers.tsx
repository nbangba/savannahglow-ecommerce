import React from 'react'
import {
    AuthProvider,
    FirestoreProvider,
    AnalyticsProvider,
    useFirebaseApp,
} from 'reactfire'
import { getAuth } from 'firebase/auth' // Firebase v9+
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

export default function Providers({
    children,
}: {
    children: JSX.Element | JSX.Element[]
}) {
    const firebaseApp = useFirebaseApp()
    const auth = getAuth(firebaseApp)
    const firestoreInstance = getFirestore(firebaseApp)
    const analytics = getAnalytics(firebaseApp)
    return (
        <AnalyticsProvider sdk={analytics}>
            <AuthProvider sdk={auth}>
                <FirestoreProvider sdk={firestoreInstance}>
                    {children}
                </FirestoreProvider>
            </AuthProvider>
        </AnalyticsProvider>
    )
}
