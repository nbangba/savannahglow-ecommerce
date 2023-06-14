import React, { useEffect } from 'react'
import Nav from './navbar'
import Footer from './footer'

export default function LayoutSSR({
    children,
}: {
    children: JSX.Element | JSX.Element[]
}) {
    return (
        <>
            <Nav />
            <main>{children}</main>
            <Footer />
        </>
    )
}
