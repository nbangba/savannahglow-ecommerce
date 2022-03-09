require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: "New Gatsby Site",
  },
  plugins: ["gatsby-plugin-styled-components",
   "gatsby-plugin-gatsby-cloud","gatsby-plugin-react-svg","gatsby-plugin-gatsby-cloud","gatsby-plugin-mdx",
   {
    resolve: `gatsby-source-contentful`,
    options: {
      spaceId: `1kk04gx3a5rx`,
      // Learn about environment variables: https://gatsby.dev/env-vars
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    },
  },
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: "GatsbyJS",
      short_name: "GatsbyJS",
      start_url: "/",
      background_color: "#6b37bf",
      theme_color: "#6b37bf",
      // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
      // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
      display: "standalone",
      icon: "src/images/icon.png", // This path is relative to the root of the site.
      // An optional attribute which provides support for CORS check.
      // If you do not provide a crossOrigin option, it will skip CORS for manifest.
      // Any invalid keyword or empty string defaults to `anonymous`
      crossOrigin: `use-credentials`,
    },
    
  },
  'gatsby-plugin-remove-serviceworker'],
};
