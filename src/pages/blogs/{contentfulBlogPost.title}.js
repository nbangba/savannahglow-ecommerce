import * as React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../../components/layout'
import styled from 'styled-components'
import { GatsbyImage} from "gatsby-plugin-image"

const Blog = styled.div`
font-family: 'Montserrat', sans-serif;
max-width:900px;
margin:auto;
padding:20px;
line-height:2em;
a{
  text-decoration: none;

}
`

const BlogWrapper = styled.div`
background: white;
`
 export default function BlogPage({ data,children }){
  const blog = data.contentfulBlogPost
  console.log(blog)
  const bodyRichText = blog.body.childMarkdownRemark.html
  return (
    <Layout >
      <BlogWrapper>
     <div style={{width:'100%',fontFamily:`'Montserrat', sans-serif`}}>
       <GatsbyImage style={{width:'100%',height:300 ,objectFit:'cover'}}image={blog.heroImage.gatsbyImageData}/>
     </div>
     <Blog>
       <div style={{display:'flex'}}>
       <div style={{justifyContent:'flex-start',alignItems:'center',display:'flex',}}>
                           <GatsbyImage style={{width:'50px' ,height:'50px',borderRadius:'50%',objectFit:'cover'}} image={blog.author.image.gatsbyImageData}/>
                           </div>
                           <div style={{padding:'5px 5px 5px 20px', flex:'1 0 60px'}}>
                           <div style={{fontWeight:'bold',color:'#ad1457'}}>{blog.author.name}</div>
                           <div style={{justifyContent:'space-between',alignItems:'center',display:'flex'}}>
                            <span>{blog.publishDate}</span>
                            {/*<small style={{color:'#1565c0'}}>{` ${blog.body.childMdx.timeToRead} min read`}</small>*/}
                            </div> 
                          </div> 
       </div>
     <h1 style={{fontFamily:`'Montserrat', sans-serif`}}>{blog.title}</h1>
     <p style={{fontFamily:`'Montserrat', sans-serif`}}>{blog.description.description}</p>
     
     <div className="body" dangerouslySetInnerHTML={{__html: bodyRichText,}}/>
     </Blog>
     </BlogWrapper> 
    </Layout>
  )
}


export const query = graphql`
query ($title: String) {
  contentfulBlogPost(title: {eq: $title}) {
    title
    body {
      childMarkdownRemark {
        html
      }
    }
    author {
      name
      image {
        gatsbyImageData(
          layout: FULL_WIDTH
          placeholder: BLURRED
          )
      }
    }
    heroImage {
      gatsbyImageData(
        layout: FULL_WIDTH
        placeholder: BLURRED
        )
    }
    description {
      description
    }
    publishDate(formatString: "DD  MMMM, YYYY", locale: "en")
  
  }
}
`