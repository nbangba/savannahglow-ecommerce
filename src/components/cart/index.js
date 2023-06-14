import React from 'react'
import CartComponent from './cart'
import Errorwrapper from '../errorwrapper'

export default function Cart() {
    return (
        <>
            <Errorwrapper>
                <CartComponent />
            </Errorwrapper>
        </>
    )
}
