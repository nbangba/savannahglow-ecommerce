import React from 'react'
import Nav from './navbar'
import Footer from './footer'

import Providers from './providers'
export default function Layout({
    children,
}: {
    children: JSX.Element | JSX.Element[]
}) {
    return (
        <Providers>
            <Nav />
            <main>{children}</main>
            <Footer />
        </Providers>
    )
}
