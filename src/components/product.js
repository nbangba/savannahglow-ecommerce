import React, { useState,useEffect } from 'react'
import styled from 'styled-components'
import { Button } from './navbar'
import { useUser,useSigninCheck,useFirestore ,useAuth,useFirestoreDocData} from 'reactfire'
import { serverTimestamp,doc, setDoc,updateDoc,increment,arrayUnion} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import Errorwrapper from './errorwrapper';
import { Input } from './addressform';
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

  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
  }

  input[type=number] {
    -moz-appearance: textfield;
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


export default function Product({data}) {
    const sgproducts = data.contentfulSavannahGlowProduct
    console.log(sgproducts)
      const [selectedVariety,setSelectedVariety] = useState(sgproducts.varieties[0])
      const [selectedImage,setSelectedImage]=useState(0)
      const [qty,setQty] = useState(selectedVariety.quantity)
      console.log(selectedVariety)
      
      useEffect(() => {
        setSelectedImage(0)
      }, [selectedVariety])
      
      const changeItemCount =(changeQty)=>{
        if(selectedVariety.quantity+changeQty > selectedVariety.available)
        setQty(selectedVariety.available)
       else if(selectedVariety.quantity+changeQty < 1) 
         setQty(1)
        else
        setQty(qty+changeQty)
        
      }
      
      useEffect(() => {
       setSelectedVariety(prev=> {return {...prev,quantity:qty}})
      }, [qty])

      return (
          
            <ProductWrapper>
            <section>
                  <Selected>
                      <ProductImageWrapper>
                      <img style={bigProduct} src={selectedVariety.images[selectedImage].fluid.src}/>
                      <ul>{selectedVariety.images.map((image,index)=>
                          <li><img src={image.fluid.src} className={`selectable`}/> </li>
                        )}
                      </ul>
                      </ProductImageWrapper>
                  </Selected>
              </section>
              <section>
              <div>
                      <h2>{sgproducts.name}</h2>
                      <hr></hr>
                      <div className='description'>{sgproducts.description.description}</div>
                      <hr></hr>
                      <div className='description price'>{`GHS ${selectedVariety.price}.00`}</div>
                      <VarietyList>
                      {
                        sgproducts.varieties.map((variety,index)=>
                        <VarietyListItem className={`${selectedVariety.name==variety.name?'highlight':''}`} 
                        onClick={()=>{setSelectedVariety(sgproducts.varieties[index])}}>
                         {variety.name}
                        </VarietyListItem>
                        )
                      }
                      </VarietyList>
                  <div>
                      <Button secondary onClick={()=> changeItemCount(-1) }>-</Button>
                       <Input onChange={(e)=>{+e.target.value>selectedVariety.available?setQty(selectedVariety.available):setQty(+e.target.value)}} 
                                onBlur={()=>{qty >selectedVariety.available?setQty(selectedVariety.available): qty<1?setQty(1):setQty(qty)}}                        
                        min={1} max={selectedVariety.available} value={qty} type='number' style={{width:50,padding:8}}/>  
                      <Button secondary onClick={()=>changeItemCount(1)}>+</Button>
                      <span>{selectedVariety.available} available</span>
                  </div>
                  <div style={{margin:'10px 0px',display:'flex',flexWrap:'wrap'}}>
                  <Button primary>Buy Now</Button>
                  <Errorwrapper>
                  <AddtoBagButton selectedVariety={selectedVariety} />
                  </Errorwrapper>
                  </div>
                     
                  </div>
              </section>
              </ProductWrapper>
      )
  }

  function AddtoBagButton({selectedVariety}){

    const db = useFirestore()

    const { data: user } = useUser()
    const { status, data: signInCheckResult } = useSigninCheck();
    const auth = useAuth();
    console.log(signInCheckResult)

    const addCart = (cartUser)=>{
      console.log('cart user',cartUser)
      setDoc(doc(db, "carts",cartUser.user.uid), {
          user:cartUser.user.uid,
          dateCreated:serverTimestamp(),
          items:[selectedVariety],
          numberOfItems:selectedVariety.quantity,
          dateCreated:serverTimestamp(),
        })
        .then(()=> console.log('cart added'))
        .catch((e)=>console.log(e))
    }

    const addToBag = ()=>{
       if(!signInCheckResult.signedIn){
        signInAnonymously(auth)
        .then((user) => {
          addCart(user)
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error)
          // ...
        });
       }
       
    }

    const AddToBag =()=>{
      const cartRef = doc(db, 'carts', user.uid);
      const { data:cart } = useFirestoreDocData(cartRef);
      const addToBag =()=>{
         if(signInCheckResult.signedIn && !cart){
          addCart(user)
      }
      else if (cart){    
          const findIndexOfVariety = cart.items.findIndex((item)=> item.name == selectedVariety.name)
          console.log('index',findIndexOfVariety)
          if(findIndexOfVariety > -1){
             const newItems = [...cart.items]
             newItems[findIndexOfVariety].quantity += selectedVariety.quantity
              console.log('newitems',newItems)
             setDoc(doc(db, "carts", user.uid), {
              items:newItems,
            },{merge:true})
            .then(()=>
              updateDoc(doc(db,"carts",user.uid), {
                  numberOfItems:increment(selectedVariety.quantity)
              },{merge:true})
              .then(()=> console.log("quantity increased")) 
              .catch((e)=>console.log(e))
            )
            .then(()=> console.log('an item quantity increased'))
            .catch((e)=>console.log(e))
          }
          else{
          updateDoc(doc(db,"carts",user.uid), {
              items:arrayUnion(selectedVariety),
              numberOfItems:increment(selectedVariety.quantity)
            },{merge:true})
            .then(()=> console.log('address updated'))
          .catch((e)=>console.log(e))
         }
       }
      }
      return(
        <Button secondary onClick={addToBag}>Add To Bag</Button>
    )
    }
    
    if(!user)
    return(
        <Button secondary onClick={addToBag}>Add To Bag</Button>
    )
    else return <AddToBag/>
  }