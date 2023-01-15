import React,{useEffect, useState} from 'react'
import { Rating } from 'react-simple-star-rating'
import styled,{css} from 'styled-components'
import { collection, where,query as q, getDoc,doc } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import Errorwrapper from './errorwrapper';
import { GatsbyImage} from "gatsby-plugin-image"

const bigProduct:any={
    width:'200px',
    height:'200px',
    objectFit: 'contain',
}

const ProductImageWrapper= styled.div`
   display:flex;
   flex-wrap:wrap;
   position:relative;
   width:fit-content;
   max-width:200px;
   text-align:center;
   padding:20px;
   justify-content:center;
`
const ProductLabels = styled.div`
   width:150px;

   ${ (props:{price?:boolean}) => props.price && css`
   font-weight: bold;
   color: blue;
   `}

`

interface ProductItemProps{
    name:string,
    subName:string,
    price:string,
    imgSrc:any,
    id:string
    
}
export default function ProductItem({name,subName,price,imgSrc,id}:ProductItemProps) {
   
    return (
                
                    <ProductImageWrapper style={{textDecoration:'none'}}>
                        <GatsbyImage style={bigProduct} image={imgSrc} alt={name}/>
                        <Errorwrapper>
                            <ProductItemRating name={name} id={id}/>
                        </Errorwrapper>
                        <ProductLabels>{name}</ProductLabels>
                        <ProductLabels>{subName}</ProductLabels>
                        <ProductLabels price>{price}</ProductLabels>
                    </ProductImageWrapper>
    )
}

interface ProductItemRatingProps{
    name:string,
    id:string
}
function ProductItemRating({name,id}:ProductItemRatingProps){
    const [productRating,setProductRating] = useState<number|null>(null)
    const db = useFirestore();
    console.log(id)
    const productsRef = doc(db,'products',id);
    useEffect(() => {
        getDoc(productsRef).then((data)=> {
          const productValues = data.data();
          console.log(productValues);
          if(productValues && productValues.rating)
          setProductRating(productValues.rating)
        })
       }, [])
    
    return(
        <Rating allowFraction initialValue={productRating?productRating:0} readonly={true} size={25} style={{width:'fit-content'}}/>
    )
}