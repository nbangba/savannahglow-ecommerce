import React, { useState,useEffect } from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/layout'
import styled from 'styled-components'
import Product from '../../components/product'
import { getAnalytics, logEvent } from "firebase/analytics";

  export default function ProductComponent({data}) {
    const analytics = getAnalytics();
    return(
       <Layout>
         <Product data={data}/>
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
      images {
        fluid {
          src
        }
      }
    }
  }
  }
`