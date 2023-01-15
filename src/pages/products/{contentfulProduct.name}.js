import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/layout'
import Product from '../../components/product'
import { getAnalytics} from "firebase/analytics";
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
    contentfulProduct(name: {eq: $name}) {
      name
      id
    description {
      description
    }
    varieties {
      name
      price
      id
      images {
        gatsbyImageData(
          layout: FULL_WIDTH
          placeholder: BLURRED
          )
      }
    }
  }
  }
`