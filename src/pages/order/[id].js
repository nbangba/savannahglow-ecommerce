import React from 'react'
import OrderComponent from '../../components/order'
import Errorwrapper from '../../components/errorwrapper'
import Layout from '../../components/layout'

export default function Order({id}) {
    return (
        <Layout>
        <Errorwrapper>
        <OrderComponent id={id}/>
        </Errorwrapper>
        </Layout>
    )
}
