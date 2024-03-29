const path = require('path')
var axios = require('axios')
import slugify from '@sindresorhus/slugify'

exports.onCreateWebpackConfig = ({ stage, loaders, actions, plugins }: any) => {
    if (stage === 'build-html' || stage === 'develop-html') {
        actions.setWebpackConfig({
            module: {
                rules: [
                    {
                        test: /firebase/,
                        use: ['null-loader'],
                    },
                    {
                        test: [/\.js$/, /\.tsx?$/, /\.ts?$/],
                        exclude: [path.resolve(__dirname, './functions/')],
                    },
                ],
            },
            resolve: {
                modules: ['node_modules'],
                alias: {
                    stream: path.resolve(
                        'node_modules/stream-browserify/index.js'
                    ),
                    zlib: path.resolve(
                        'node_modules/browserify-zlib/lib/index.js'
                    ),
                    path: path.resolve('node_modules/path-browserify/index.js'),
                    firebase: false,
                    'dialog-polyfill': false,
                    'material-design-lite': false,
                    //'styled-components':false,
                    // "@emotion":false,
                },
                fallback: { fs: false, crypto: false },
            },
            plugins: [
                plugins.provide({
                    process: 'process/browser',
                    Buffer: ['buffer', 'Buffer'],
                }),
            ],
        })
    } else
        actions.setWebpackConfig({
            module: {
                rules: [
                    {
                        test: [/\.js$/, /\.tsx?$/, /\.ts?$/],
                        exclude: [path.resolve(__dirname, './functions/')],
                    },
                ],
            },
            resolve: {
                modules: ['node_modules'],
                alias: {
                    stream: path.resolve(
                        'node_modules/stream-browserify/index.js'
                    ),
                    zlib: path.resolve(
                        'node_modules/browserify-zlib/lib/index.js'
                    ),
                    path: path.resolve('node_modules/path-browserify/index.js'),
                },
                fallback: {
                    fs: false,
                    crypto: false,
                    zlib: path.resolve(
                        'node_modules/browserify-zlib/lib/index.js'
                    ),
                },
            },
            plugins: [
                plugins.provide({
                    process: 'process/browser',
                    Buffer: ['buffer', 'Buffer'],
                }),
            ],
        })
}
/*exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    const typeDefs = `
      type StrapiCategory implements Node {
        name: String!
        products: [StrapiProduct]!
        sub_categories: [StrapiSubCategory]!
      }
      type StrapiProduct {
        name: String!
      }
      type StrapiSubCategory {
        name: String!
        products: [StrapiProduct]!
      }
    `
    createTypes(typeDefs)
  }*/

exports.sourceNodes = async ({
    actions: { createNode },
    createContentDigest,
}) => {
    var accessConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.FIREBASE_API_KEY}`,
        headers: {},
    }

    const fireStoreAccess = await axios(accessConfig)
        .then(function (response) {
            console.log(JSON.stringify(response.data))
            return response.data
        })
        .catch(function (error) {
            console.log(error)
        })

    var ratingsConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://firestore.googleapis.com/v1/projects/savannahglow-65324/databases/(default)/documents/products/',
        headers: {
            Authorization: `Bearer ${fireStoreAccess.idToken}`,
        },
    }

    const productsRatings = await axios(ratingsConfig)
        .then(function (response) {
            console.log(JSON.stringify(response.data))
            return response.data
        })
        .catch(function (error) {
            console.log(error)
        })
    // get data from GitHub API at build time
    const result = await productsRatings
    //const resultData = await result.json();
    // create node for build time data example in the docs
    createNode({
        // nameWithOwner and url are arbitrary fields from the data
        documents: result.documents,

        // required fields
        id: `example-build-time-data`,
        parent: null,
        children: [],
        internal: {
            type: `ProductRating`,
            contentDigest: createContentDigest(result),
        },
    })
}
exports.createPages = async function ({ actions, graphql }: any) {
    const { data: strapiCategory } = await graphql(`
        query {
            allStrapiCategory {
                nodes {
                    name
                    products {
                        name
                    }
                    subcategories {
                        name
                        products {
                            name
                        }
                    }
                }
            }
        }
    `)

    console.log('StrapiCategory', strapiCategory)

    strapiCategory.allStrapiCategory.nodes.forEach((node) => {
        const categoryName = node.name
        actions.createPage({
            path: `/category/${slugify(categoryName)}`,
            component: path.resolve(
                `./src/components/templates/categorytemplate.tsx`
            ),
            context: {
                name: categoryName,
            },
        })

        if (node.products.length > 0)
            node.products.forEach((product) => {
                const productName = product.name
                actions.createPage({
                    path: `/category/${slugify(categoryName)}/${slugify(
                        productName
                    )}`,
                    component: path.resolve(
                        `./src/components/templates/productitemtemplate.tsx`
                    ),
                    context: { name: productName },
                })
            })

        if (node.subcategories.length > 0)
            node.subcategories.forEach((subcategory) => {
                const subCategoryName = subcategory.name
                actions.createPage({
                    path: `/category/${slugify(categoryName)}/${slugify(
                        subCategoryName
                    )}`,
                    component: path.resolve(
                        `./src/components/templates/subcategorytemplate.tsx`
                    ),
                    context: { name: categoryName, subName: subCategoryName },
                })

                if (subcategory.products.length > 0)
                    subcategory.products.forEach((product) => {
                        const productName = product.name
                        actions.createPage({
                            path: `/category/${slugify(categoryName)}/${slugify(
                                subCategoryName
                            )}/${slugify(productName)}`,
                            component: path.resolve(
                                `./src/components/templates/productitemtemplate.tsx`
                            ),
                            context: { name: productName },
                        })
                    })
            })
    })
}
