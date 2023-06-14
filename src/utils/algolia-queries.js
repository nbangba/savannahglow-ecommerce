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
}`

function pageToAlgoliaRecord({
    name,
    description,
    id,
    brand,
    varieties,
    internal,
    ...rest
}) {
    return {
        objectID: id,
        name,
        brand,
        description,
        varieties: varieties[0],
        numberOfVarieties: varieties.length,
        internal,
        ...rest,
    }
}

const queries = [
    {
        query: pageQuery,
        transformer: ({ data }) =>
            data.allStrapiProduct.nodes.map(pageToAlgoliaRecord),
        indexName,
        settings: { attributesToSnippet: [`description:10`] },
    },
]

module.exports = queries
