import React from 'react'
import Layout from '../components/layout'
import SignIn from '../components/signin'
import { getAnalytics, logEvent } from "firebase/analytics";
export default function Sign() {
    const analytics = getAnalytics();
    return ( 
           <SignIn/>  
    )
}