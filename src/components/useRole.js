import React, { useState ,useEffect} from 'react'
import { useAuth } from 'reactfire'

export default function useRole() {
    const [role, setRole] = useState(null)
    const {currentUser} = useAuth()
    
    useEffect(() => {
        currentUser && currentUser.getIdTokenResult()
        .then((idTokenResult) => {
         // Confirm the user is an Admin.
         if (!!idTokenResult.claims.role ) {
           console.log(idTokenResult.claims.role)
           setRole(idTokenResult.claims.role)
         } else {
           // Show regular user UI.
          setRole('none')
         }
        })
        .catch((error) => {
            console.log(error);
        });
    
    },[currentUser])
   
    return {role: role}
}
