import React from 'react'
import FAQComponent from '../components/faq'
import { graphql } from 'gatsby'

export default function faq({ data }) {
    return (
        <>
            <FAQComponent data={data} />
        </>
    )
}

export const query = graphql`
    query {
        allContentfulSgFaq {
            nodes {
                question
                answer {
                    answer
                }
            }
        }
    }
`
