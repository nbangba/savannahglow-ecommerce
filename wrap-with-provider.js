import React from "react"
import { Provider } from "react-redux"
import store from "./src/store"
import { createFirestoreInstance} from 'redux-firestore'
import firebase from "./src/firebase/fbconfig"
import { ReactReduxFirebaseProvider, useFirestore} from 'react-redux-firebase'
// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => {
    const rrfConfig = {
        userProfile: 'users',
         useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
      }
    const rrfProps = {
        firebase,
        config: rrfConfig,
        dispatch: store.dispatch,
        createFirestoreInstance // <- needed if using firestore
      }
  // Instantiating store in `wrapRootElement` handler ensures:
  //  - there is fresh store for each SSR page
  //  - it will be called only once in browser, when React mounts
  return <Provider store={store}><ReactReduxFirebaseProvider {...rrfProps}>{element}</ReactReduxFirebaseProvider></Provider>
}