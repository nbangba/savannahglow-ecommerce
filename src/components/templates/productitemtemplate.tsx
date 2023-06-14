import React from 'react'
import { graphql } from 'gatsby'
import Product from '../product/product'
import Errorwrapper from '../errorwrapper'

export default function ProductComponent({ data }: any) {
    console.log('prouct', data)
    return (
        <Errorwrapper>
            <Product data={data} />
        </Errorwrapper>
    )
}

export const query = graphql`
    query ($name: String) {
        productInfo: strapiProduct(name: { eq: $name }) {
            name
            id
            description
            brand
            varieties {
                description
                id
                name
                price
                images {
                    id
                    localFile {
                        childImageSharp {
                            fluid {
                                src
                            }
                            gatsbyImageData(
                                layout: FULL_WIDTH
                                placeholder: BLURRED
                            )
                        }
                    }
                }
            }
        }
        productRating: productRating(
            documents: {
                elemMatch: {
                    fields: { productName: { stringValue: { eq: $name } } }
                }
            }
        ) {
            documents {
                fields {
                    numberOfRating {
                        integerValue
                    }
                    rating {
                        doubleValue
                        integerValue
                    }
                    productName {
                        stringValue
                    }
                }
            }
        }
    }
`
