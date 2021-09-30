import { reference } from '@popperjs/core';
import { getFunctions,httpsCallable } from 'firebase/functions';
import {useFirebaseApp} from 'reactfire'

const functions = getFunctions();
const addMessage = httpsCallable(functions, 'payStackTransctionVerification');
export function verifyPaystack(info,response){
    addMessage({info:info,response:response })
    .then((result) => {
        console.log(info,response)
        window.location = "http://localhost:8000/verification/" + response.reference;
    })
    .catch((err)=>console.log(err))
}
