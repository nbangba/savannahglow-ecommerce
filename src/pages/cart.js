import React from 'react'
import Layout from '../components/layout'
import CartComponent from '../components/cart'
import Errorwrapper from '../components/errorwrapper'


export default function Cart() {

    return (
        <>
          <Errorwrapper>
          <CartComponent/>
          </Errorwrapper>
        </>
    )
}

