require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: "New Gatsby Site",
  },
  plugins: ["gatsby-plugin-styled-components",
   "gatsby-plugin-gatsby-cloud","gatsby-plugin-react-svg","gatsby-plugin-gatsby-cloud"],
};
