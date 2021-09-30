import { getFunctions,httpsCallable } from 'firebase/functions';


export function verifyPaystack(info,response){
    const functions =  getFunctions();
    const addMessage = httpsCallable(functions, 'payStackTransctionVerification');
    
    addMessage({info:info,response:response })
    .then((result) => {
        console.log(info,response)
        window.location = "http://localhost:8000/verification/" + response.reference;
    })
    .catch((err)=>console.log(err))
}
