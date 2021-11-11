import React from 'react'
import Errorwrapper from '../../components/errorwrapper'
import Users from '../../components/users'
import { getAnalytics, logEvent } from "firebase/analytics";

export default function AdminOrders() {
    const analytics = getAnalytics();
    return (
            <Errorwrapper>
               <Users/>
            </Errorwrapper>
    )
}
