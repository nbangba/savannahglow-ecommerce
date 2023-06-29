import React, { useEffect } from 'react'
import { graphql } from 'gatsby'
import Product from '../../components/product/product'
import Errorwrapper from '../../components/errorwrapper'
import SEO from '../../components/seo'
import slugify from '@sindresorhus/slugify'

export default function ProductComponent({ data }) {
    console.log('product', data)
    return (
        <>
            <Errorwrapper>
                <Product data={data} />
            </Errorwrapper>
        </>
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

export function Head({ data }) {
    const product = data.productInfo
    const productRating = data.productRating
        ? data.productRating.documents[0]
        : null
    console.log(productRating)
    const rating = productRating
        ? productRating.fields.rating.doubleValue |
          productRating.fields.rating.integerValue
        : 0
    const numberOfRatings = productRating
        ? productRating.fields.numberOfRating.integerValue
        : 0

    return (
        <SEO
            title={`${product.name}`}
            description={`${product.description}`}
            pathname={`${slugify(product.name)}`}
        >
            <script type="application/ld+json">
                {JSON.stringify({
                    '@context': 'https://schema.org/',
                    '@type': 'Product',
                    name: `${product.name}`,
                    image: [
                        `${product.varieties[0].images[0].localFile.childImageSharp.fluid.src}`,
                    ],
                    description: `${product.description}`,
                    brand: {
                        '@type': 'Brand',
                        name: `${product.brand}`,
                    },

                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: `${rating}`,
                        reviewCount: `${numberOfRatings}`,
                    },

                    offers: {
                        '@type': 'Offer',
                        price: `${product.varieties[0].price}`,
                        priceCurrency: 'GHS',
                    },
                })}
            </script>
        </SEO>
    )
}
