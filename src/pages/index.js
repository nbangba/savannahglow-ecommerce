import * as React from "react"
import {Link} from 'gatsby'
import Layout from "../components/layout"
import  '../styles/global.css'
import Home from '../components/home'
import {Helmet} from "react-helmet";

const IndexPage = () => {
  return (
      <Layout>
        
        <Home/>
      </Layout>
  )
}

export default IndexPage
