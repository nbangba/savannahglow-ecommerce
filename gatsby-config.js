require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: "New Gatsby Site",
  },
  plugins: ["gatsby-plugin-styled-components",
   "gatsby-plugin-gatsby-cloud","gatsby-plugin-react-svg","gatsby-plugin-gatsby-cloud",
   {
    resolve: `gatsby-source-contentful`,
    options: {
      spaceId: `5mbi5b3yl438`,
      // Learn about environment variables: https://gatsby.dev/env-vars
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    },
  },],
};
