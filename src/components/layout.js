import React from 'react'
import Nav from './navbar'
import Footer from './footer'

export default function Layout({children}) {
    return (
        <>
           <Nav/>
           <main>
            {children}
           </main>
           <Footer/>
        </>
    )
}
