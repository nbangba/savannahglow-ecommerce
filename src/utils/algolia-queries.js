const escapeStringRegexp = require('escape-string-regexp')

const pagePath = `content`
const indexName = `Pages`

const pageQuery = `{
  allStrapiProduct {
      nodes {
        name
        description
        id
        brand
        internal {
        contentDigest
       }
        varieties {
          name
          id
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
  productsRatings: allProductRating {
            nodes {
                documents {
                    fields {
                        productName {
                            stringValue
                        }
                        numberOfRating {
                            integerValue
                        }
                        rating {
                            integerValue
                            doubleValue
                        }
                    }
                }
            }
        }
}`

function pageToAlgoliaRecord({
    name,
    description,
    id,
    brand,
    varieties,
    internal,
    productRating,
    ...rest
}) {
    return {
        objectID: id,
        name,
        brand,
        description,
        varieties: varieties[0],
        numberOfVarieties: varieties.length,
        productRating: productRating[0],
        internal,
        ...rest,
    }
}

function addRating(products, ratings) {
    return products.map((product) => {
        return {
            objectID: product.id,
            name: product.name,
            brand: product.brand,
            description: product.description,
            varieties: product.varieties[0],
            numberOfVarieties: product.varieties.length,
            productRating: ratings.filter(
                (rating) =>
                    rating.fields.productName.stringValue == product.name
            ),
            internal: product.internal,
            ...product,
        }
    })
}

const queries = [
    {
        query: pageQuery,
        transformer: ({ data }) =>
            addRating(
                data.allStrapiProduct.nodes,
                data.productsRatings.nodes[0].documents
            ).map(pageToAlgoliaRecord),
        indexName,
        settings: { attributesToSnippet: [`description:10`] },
    },
]

module.exports = queries
