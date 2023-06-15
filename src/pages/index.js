import * as React from 'react'
import '../styles/global.css'
import Home from '../components/home'
import { graphql } from 'gatsby'
import SEO from '../components/seo'
const IndexPage = ({ data }) => {
    return (
        <>
            <Home data={data} />
        </>
    )
}

export default IndexPage

export const query = graphql`
    query {
        strapiHomePage {
            brandname
            headerforwhyuse {
                header2
            }
            heading {
                header2
            }
            whyuse {
                maintext
                description
                image {
                    localFile {
                        childImageSharp {
                            gatsbyImageData(
                                layout: FULL_WIDTH
                                placeholder: BLURRED
                            )
                        }
                    }
                    alternativeText
                }
            }
            benefit {
                benefit
            }
            productimage {
                localFile {
                    childImageSharp {
                        gatsbyImageData(
                            layout: FULL_WIDTH
                            placeholder: BLURRED
                        )
                    }
                }
                alternativeText
            }
            midsectionbanner {
                maintext
                subtext
                image {
                    localFile {
                        childImageSharp {
                            gatsbyImageData(
                                layout: FULL_WIDTH
                                placeholder: BLURRED
                            )
                        }
                    }
                    alternativeText
                }
            }
            testimonies {
                nameofperson
                testimony
            }
            subheading {
                header2
            }
        }
    }
`

export function Head({ data }) {
    const category = data.strapiCategory
    return <SEO></SEO>
}
