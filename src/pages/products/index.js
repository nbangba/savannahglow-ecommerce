import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/layout'
import ProductItem from '../../components/productitem'
import styled from 'styled-components'
import slugify from '@sindresorhus/slugify';
import { Link } from 'gatsby'
import { getAnalytics, logEvent } from "firebase/analytics";

import { useFirestore } from 'react-redux-firebase'
const ProductsWrapper = styled.div`
  margin:20px;
  font-family: 'Montserrat', sans-serif;
  color:#35486F;
  ul{
    display:flex;
    width:100%;
    padding:0;
    flex-wrap:wrap;
    justify-content:center;
  }
  li{
    display:flex;
    width:fit-content;
    margin: 10px;
  }
`
export default function Products({data}) {
     const sgproducts = data.allContentfulProduct.nodes
     console.log(sgproducts)
     const analytics = getAnalytics();
     
    return (
        <Layout>
          <ProductsWrapper>
            <ul>
              {sgproducts.map(node=> <li>
                  
                   <Link to={`${slugify(node.name)}`} style={{textDecoration:'none'}}>
                   <ProductItem 
                     name={node.name} 
                     subName={node.varieties[0].name} 
                     price={`GHS ${node.varieties[0].price}.00`} 
                     imgSrc={ node.varieties[0].images[0].fluid.src}
                     id={node.id}/>
                    </Link>
                             
              </li>)}
            </ul>
            </ProductsWrapper>
        </Layout>
    )
}

export const query = graphql`
    query {
      allContentfulProduct {
        nodes {
          id
          name
          description {
            description
          }
          varieties {
            name
            price
            images {
              fluid {
                src
              }
            }
          }
        }
      }
    }
`