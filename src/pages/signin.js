import React from 'react'
import SignIn from '../components/signin'
import { useAnalytics } from 'reactfire';

export default function Sign() {
    
      useAnalytics()  
    
    
    return ( 
           <SignIn/>  
    )
}