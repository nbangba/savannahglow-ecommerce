import React from 'react'
import Errorwrapper from '../../components/errorwrapper'
import Layout from '../../components/layout'
import AdminCustomers from '../../components/adminCustomerOrders'
import { getAnalytics, logEvent } from "firebase/analytics";

export default function AdminOrders() {
    const analytics = getAnalytics();
    return (
            <Errorwrapper>
               <AdminCustomers/>
            </Errorwrapper>
    )
}
