require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
})

const strapiConfig = {
    apiURL: process.env.STRAPI_API_URL || 'http://127.0.0.1:1337',
    accessToken:
        process.env.STRAPI_TOKEN ||
        '360a3d90edb175d7fe0e6ea8e8c307487c3a83ca2c6521e1fde41898a607f76d0972e283f1978d7935dad5fa6a4bc8ac87c453f6a6437aa75602f08abf5a0bbccb21b4e02c93d7d781c2706fad4091e7968c2d7f8dbc6880641ca6139990880027159ea9c4e6b92897262ba99e39bc49ad635051d1f67c5c3aa89b7e41de6db4',
    collectionTypes: [
        {
            singularName: 'product',
            queryParams: {
                populate: {
                    varieties: { populate: { images: '*' } },
                    category: {
                        populate: {
                            products: {
                                populate: {
                                    varieties: { populate: { images: '*' } },
                                },
                            },
                            subcategories: {
                                populate: {
                                    products: {
                                        populate: {
                                            varieties: {
                                                populate: { images: '*' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    subcategory: {
                        populate: {
                            products: {
                                populate: {
                                    varieties: { populate: { images: '*' } },
                                },
                            },
                        },
                    },
                },
            },
        },
        'tag',
        'seo',
        {
            singularName: 'variety',
            queryParams: {
                populate: {
                    images: '*',
                },
            },
        },
        {
            singularName: 'subcategory',
            queryParams: {
                populate: {
                    products: {
                        populate: { varieties: { populate: { images: '*' } } },
                    },
                },
            },
        },
        {
            singularName: 'category',
            queryParams: {
                populate: {
                    products: {
                        populate: { varieties: { populate: { images: '*' } } },
                    },
                    subcategories: {
                        populate: {
                            products: {
                                populate: {
                                    varieties: { populate: { images: '*' } },
                                },
                            },
                        },
                    },
                },
            },
        },
    ],
    singleTypes: [
        {
            singularName: 'home-page',
            queryParams: {
                // Populate media and relations
                // Make sure to not specify the fields key so the api always returns the updatedAt
                populate: {
                    headerforwhyuse: '*',
                    heading: '*',
                    subheading: '*',
                    benefit: '*',
                    testimonies: '*',
                    productimage: '*',
                    midsectionbanner: {
                        populate: {
                            image: '*',
                        },
                    },
                    whyuse: {
                        populate: {
                            image: '*',
                        },
                    },
                },
            },
        },
    ],
}

module.exports = {
    flags: {
        DEV_SSR: true,
    },
    siteMetadata: {
        title: 'Savannah Glow: Shea Butter from Ghana',
        description:
            'The best unrefined shea butter from Ghana, ideal beauty product for skin and hair. World wide delivery.',
        image: 'static/savannah-glow-shea-butter.png',
        siteUrl: `https://www.savannahglow.com/`,
    },
    plugins: [
        'gatsby-plugin-styled-components',
        'gatsby-plugin-gatsby-cloud',
        `gatsby-plugin-netlify`,
        {
            resolve: 'gatsby-plugin-react-svg',
            options: {
                rule: {
                    include: /svgs/,
                },
            },
        },
        {
            resolve: `gatsby-plugin-algolia`,
            options: {
                appId: process.env.GATSBY_ALGOLIA_APP_ID,
                apiKey: process.env.ALGOLIA_ADMIN_KEY,
                queries: require('./src/utils/algolia-queries'),
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {},
        },
        'gatsby-plugin-gatsby-cloud',
        'gatsby-plugin-mdx',
        `gatsby-plugin-typescript`,
        'gatsby-plugin-image',
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-source-contentful`,
            options: {
                spaceId: `1kk04gx3a5rx`,
                // Learn about environment variables: https://gatsby.dev/env-vars
                accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
            },
        },
        {
            resolve: `gatsby-source-strapi`,
            options: strapiConfig,
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: 'Savannah Glow',
                short_name: 'Savannah Glow',
                start_url: '/',
                background_color: '#6b37bf',
                theme_color: '#6b37bf',
                // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
                // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
                display: 'standalone',
                icon: 'src/images/svgs/logo.svg', // This path is relative to the root of the site.
                // An optional attribute which provides support for CORS check.
                // If you do not provide a crossOrigin option, it will skip CORS for manifest.
                // Any invalid keyword or empty string defaults to `anonymous`
                crossOrigin: `use-credentials`,
            },
        },
        'gatsby-plugin-remove-serviceworker',
    ],
}
