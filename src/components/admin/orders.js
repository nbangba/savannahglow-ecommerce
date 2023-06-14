import React from 'react'
import Errorwrapper from '../errorwrapper'
import AdminCustomers from './adminCustomerOrders'

export default function AdminOrders() {
    return (
        <Errorwrapper>
            <AdminCustomers />
        </Errorwrapper>
    )
}
