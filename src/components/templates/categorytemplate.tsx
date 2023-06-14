import React from 'react'
import { graphql } from 'gatsby'
import ProductItem from '../product/productitem'
import styled from 'styled-components'
import slugify from '@sindresorhus/slugify'
import { Link } from 'gatsby'

const ProductsWrapper = styled.div`
    margin: 20px;
    font-family: 'Montserrat', sans-serif;
    color: #35486f;
    ul {
        display: flex;
        width: 100%;
        padding: 0;
        flex-wrap: wrap;
        justify-content: center;
    }
    li {
        display: flex;
        width: fit-content;
        margin: 10px;
    }
`
export default function Products({ data, location }: any) {
    const sgproducts = data.allStrapiProduct.nodes
    console.log(sgproducts)
    return (
        <ProductsWrapper>
            <ul>
                {sgproducts.map((node: any) => (
                    <li>
                        <Link
                            to={`${location.pathname}${slugify(node.name)}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <ProductItem
                                name={node.name}
                                subName={node.varieties[0].name}
                                price={`GHS ${node.varieties[0].price}.00`}
                                imgSrc={
                                    node.varieties[0].images[0].localFile
                                        .childImageSharp.gatsbyImageData
                                }
                                id={node.id}
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </ProductsWrapper>
    )
}

export const query = graphql`
    query ($name: String) {
        allStrapiProduct(filter: { category: { name: { eq: $name } } }) {
            nodes {
                brand
                name
                description
                id
                varieties {
                    name
                    description
                    price
                    images {
                        localFile {
                            childImageSharp {
                                gatsbyImageData(
                                    layout: FULL_WIDTH
                                    placeholder: BLURRED
                                )
                            }
                        }
                    }
                }
            }
        }
    }
`
