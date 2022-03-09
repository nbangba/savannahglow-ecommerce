import React from 'react'
import Layout from '../components/layout'
import FAQComponent from '../components/faq'
import { graphql } from 'gatsby'

export default function faq({data}) {
  return (
    <Layout>
    <FAQComponent data={data}/>
    </Layout>
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