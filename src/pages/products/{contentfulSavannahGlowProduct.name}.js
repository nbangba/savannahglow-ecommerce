import React, { useState,useEffect } from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/layout'
import ProductItem from '../../components/productitem'
import styled from 'styled-components'
import { Button } from '../../components/navbar'
import { useUser,useSigninCheck,useFirebaseApp ,useAuth} from 'reactfire'
import { collection, addDoc, serverTimestamp,doc, setDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import Errorwrapper from '../../components/errorwrapper'
import Product from '../../components/product'

const product ={
  width:'100px',
  height:'100px'
}

const bigProduct={
  minWidth:'200px',
  width:'100%',
  objectFit: 'cover',
  width:'auto',
  maxHeight:400,
}

const ProductImageWrapper= styled.div`
 position:relative;
 text-align:center;
 box-sizing:border-box;
 display:flex;
 flex-wrap:wrap;
 width:100%;
 ul{
   display:flex;
   padding:0px;
   width:100%;
 }

li{
  display:block;
}


`


const Selected = styled.div`
display:flex;
flex-wrap:wrap;  
box-sizing:border-box;
width:100%;


 .selectable{
  width:40px;
  height:40px;
  object-fit:cover;
  padding:10px;
 }
`
const ProductWrapper = styled.div`
  display:flex;
  flex-wrap:wrap;
  flex:1 0 200px;
  
  section{
    width:50%;
    padding:20px;
    box-sizing:border-box;
  }

  span,h2,h3,ul,.description{
    width:100%;
    font-family: 'Montserrat', sans-serif;
    color:#35486F;
    text-align:left;
   }

   .highlight{
    border: 2px solid #35486F;
    box-shadow: 0 0 10px #9bb2e1;
  }

  .price{
    font-weight:500;
    font-size:24px;
    color:#3f51b5;
  }

  hr{
    border: 0;
    border-top: 1px solid #979aae;
  }
  
`
const VarietyList = styled.ul`
 padding:0px;
  width:100%;
  display:flex;
  flex-wrap:wrap;
`

const VarietyListItem = styled.li`
  display:block;
  width:100px;
  border: 1px solid #7e7d7d;
  cursor:pointer;
  padding:5px;
  margin:5px;

  &:hover{
    background:#e0cbba;
  }
  `
  export default function ProductComponent({data}) {
    return(
       <Layout>
         <Product data={data}/>
       </Layout>
    )
  }

export const query = graphql`
query ($name: String) {
    contentfulSavannahGlowProduct(name: {eq: $name}) {
      name
    description {
      description
    }
    varieties {
      name
      price
      quantity
      available
      images {
        fluid {
          src
        }
      }
    }
  }
  }
`