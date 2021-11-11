import React from 'react'
import Layout from '../components/layout'
import CartComponent from '../components/cart'
import Errorwrapper from '../components/errorwrapper'
import { getAnalytics, logEvent } from "firebase/analytics";

export default function Cart() {
  const analytics = getAnalytics();
    return (
        <Layout>
          <Errorwrapper>
          <CartComponent/>
          </Errorwrapper>
        </Layout>
    )
}

