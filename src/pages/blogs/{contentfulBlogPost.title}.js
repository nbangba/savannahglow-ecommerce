import * as React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../../components/layout'
import styled from 'styled-components'

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
const BlogPage = ({ data }) => {
  const blog = data.contentfulBlogPost
  console.log(blog)
  return (
    <Layout >
      <BlogWrapper>
     <div style={{width:'100%',fontFamily:`'Montserrat', sans-serif`}}>
       <img style={{width:'100%',height:300 ,objectFit:'cover'}}srcSet={blog.heroImage.fluid.srcSet}/>
     </div>
     <Blog>
       <div style={{display:'flex'}}>
       <div style={{justifyContent:'flex-start',alignItems:'center',display:'flex',}}>
                           <img style={{width:'50px' ,height:'50px',borderRadius:'50%',objectFit:'cover'}} srcSet={blog.author.image.fluid.srcSet}/>
                           </div>
                           <div style={{padding:'5px 5px 5px 20px', flex:'1 0 60px'}}>
                           <div style={{fontWeight:'bold',color:'#ad1457'}}>{blog.author.name}</div>
                           <div style={{justifyContent:'space-between',alignItems:'center',display:'flex'}}>
                            <span>{blog.publishDate}</span>
                            <small style={{color:'#1565c0'}}>{` ${blog.body.childMdx.timeToRead} min read`}</small>
                            </div> 
                          </div> 
       </div>
     <h1 style={{fontFamily:`'Montserrat', sans-serif`}}>{blog.title}</h1>
     <p style={{fontFamily:`'Montserrat', sans-serif`}}>{blog.description.description}</p>
     
      <MDXRenderer>{blog.body.childMdx.body}</MDXRenderer>
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
      body
      childMdx {
        timeToRead
        slug
        body
      }
    }
    author {
      name
      image {
        fluid {
          srcSet
        }
      }
    }
    heroImage {
      fluid {
        srcSet
      }
    }
    description {
      description
    }
    publishDate(formatString: "DD  MMMM, YYYY", locale: "en")
  
  }
}
`
export default BlogPage