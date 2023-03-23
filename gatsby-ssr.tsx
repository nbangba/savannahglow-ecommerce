import React from "react"
import wrapWithProvider from "./wrap-with-provider"
import LayoutSSR from "./src/components/layout-ssr"
import Layout from "./src/components/layout"

export const wrapRootElement = wrapWithProvider

export const wrapPageElement = ({ element, props }) => {
    if (typeof window === "undefined") 
    return <LayoutSSR {...props}>{element}</LayoutSSR>
    
    return <Layout {...props}>{element}</Layout>
  }