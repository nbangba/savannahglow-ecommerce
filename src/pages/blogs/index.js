import React from 'react'
import { graphql } from 'gatsby'
import { Card } from '../../components/card'
import { CardItem } from '../../components/addresscard'
import Layout from '../../components/layout'
import slugify from '@sindresorhus/slugify';
import { Link } from 'gatsby'
import styled from 'styled-components'
import { GatsbyImage} from "gatsby-plugin-image"
const StyledLink = styled(Link)`
    text-decoration:none;

    &:hover{
      h3{
        text-decoration:underline
      }
    }
`
export default function BlogPost({data}) {
    console.log(data)
    const blogs = data.allContentfulBlogPost.nodes
  return (
    <Layout>
      <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',alignItems:'top'}}>
      {
      blogs.map((blog)=>
                        <Card > 
                          <StyledLink to={`${slugify(blog.title)}`}>
                         <CardItem><GatsbyImage style={{width:'100%', objectFit:'contain'}}image={blog.heroImage.gatsbyImageData}  /></CardItem>
                         <CardItem><h3>{blog.title}</h3></CardItem>
                         <CardItem><p>{blog.description.description}</p></CardItem>
                         </StyledLink>
                         <CardItem style={{dispay:'flex'}}>
                        
                           <div style={{justifyContent:'center',alignItems:'center',display:'flex',}}>
                           <GatsbyImage style={{width:'50px' ,height:'50px',borderRadius:'50%',objectFit:'cover'}} image={blog.author.image.gatsbyImageData}  />
                          {/*<img style={{width:'50px' ,height:'50px',borderRadius:'50%',objectFit:'cover'}} srcSet={blog.author.image.gatsbyImage.images.sources[0].srcSet}/>*/}
                           </div>
                           <div style={{padding:'5px 5px 5px 20px', flex:'1 0 60px'}}>
                           <div style={{fontWeight:'bold',color:'#ad1457'}}>{blog.author.name}</div>
                           <div style={{justifyContent:'space-between',alignItems:'center',display:'flex'}}>
                            <span>{blog.publishDate}</span>
                            {/*<small style={{color:'#1565c0'}}>{` ${blog.body.childMdx.timeToRead} min read`}</small>*/}
                            </div> 
                          </div> 
                          </CardItem>
                        </Card>
        )
      }
    </div>
    </Layout>
  )
  
}
export const query = graphql`
    query {
      allContentfulBlogPost {
        nodes {
          slug
          tags
          title
          publishDate(formatString: "DD  MMMM, YYYY", locale: "en")
          description {
            description
          }
          heroImage {
           gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: BLURRED
            )
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
        }
      }
    }
`