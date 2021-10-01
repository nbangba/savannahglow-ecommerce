import React from 'react'
import styled from 'styled-components'

const bigProduct={
    width:'200px',
    height:'200px',
    objectFit:'contain',
}

const ProductImageWrapper= styled.div`
   display:flex;
   flex-wrap:wrap;
   position:relative;
   width:fit-content;
   max-width:fit-content;
   text-align:center;
   padding:20px;
   justify-content:center;
`
const ProductLabels = styled.div`
   width:150px;
`
export default function ProductItem({name,subName,price,imgSrc}) {
   
    return (
                
                    <ProductImageWrapper>
                    <img style={bigProduct} src={imgSrc}/>
                    <ProductLabels>{name}</ProductLabels>
                    <ProductLabels>{subName}</ProductLabels>
                    <ProductLabels>{price}</ProductLabels>
                    </ProductImageWrapper>
    )
}
