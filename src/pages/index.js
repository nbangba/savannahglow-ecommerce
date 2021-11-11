import * as React from "react"
import Layout from "../components/layout"
import  '../styles/global.css'
import Home from '../components/home'
import {Helmet} from "react-helmet";
import { getAnalytics, logEvent } from "firebase/analytics";
const IndexPage = () => {
  const analytics = getAnalytics();
  return (
      <Layout>
        
        <Home/>
      </Layout>
  )
}

export default IndexPage
