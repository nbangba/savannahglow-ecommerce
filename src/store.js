import { createStore, combineReducers, compose } from 'redux'
import { firebaseReducer} from 'react-redux-firebase'
import {firestoreReducer } from 'redux-firestore'


  const rootReducer = combineReducers({
    firebase: firebaseReducer,
     firestore: firestoreReducer // <- needed if using firestore
  })
  
  const store = createStore(rootReducer)
  
  

  export default store
  