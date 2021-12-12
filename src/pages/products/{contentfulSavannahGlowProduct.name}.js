import React, { useState,useEffect } from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/layout'
import styled from 'styled-components'
import Product from '../../components/product'
import { getAnalytics, logEvent } from "firebase/analytics";
import Errorwrapper from '../../components/errorwrapper'

  export default function ProductComponent({data}) {
    const analytics = getAnalytics();
    return(
       <Layout>
         <Errorwrapper>
         <Product data={data}/>
         </Errorwrapper>
       </Layout>
    )
  }

export const query = graphql`
query ($name: String) {
    contentfulSavannahGlowProduct(name: {eq: $name}) {
      name
    description {
      description
    }
    varieties {
      name
      price
      quantity
      available
      id
      images {
        fluid {
          src
        }
      }
    }
  }
  }
`