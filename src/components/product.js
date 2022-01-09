import React, { useState,useEffect } from 'react'
import styled from 'styled-components'
import { Button } from './navbar'
import { useUser,useSigninCheck,useFirestore ,useAuth,useFirestoreDocData} from 'reactfire'
import { serverTimestamp,doc, setDoc,updateDoc,increment,arrayUnion,getDoc} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import Errorwrapper from './errorwrapper';
import Review from './review';
import ModalComponent from './modal';
import { Formik,Form } from 'formik';
import { InputWrapper,Label,Input ,Button as Btn} from './addressform';
import { Rating } from 'react-simple-star-rating'

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
  justify-content:center;
  
  section{
    width:50%;
    padding:20px;
    box-sizing:border-box;
    flex:1 0 300px;
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

  @media only screen and (max-width: 633px) {
    .top{
      order:1;
      min-width:100%;
    }
    .bottom{
      order:2;
      min-width:100%;
    }
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
    
    const db = useFirestore()
    const sgproducts = data.contentfulProduct
    
    console.log(sgproducts)
      const [selectedVariety,setSelectedVariety] = useState(sgproducts.varieties[0])
      const [productRating,setProductRating] = useState(null)
      const [selectedImage,setSelectedImage]=useState(0)
      const [qty,setQty] = useState(1)
      const [showModal, setShowModal] = useState(false)
      const firestore = useFirestore();
      const ref = doc(firestore, 'product',selectedVariety.id );
      const { status, data: product } = useFirestoreDocData(ref);
      const { data: user } = useUser()
      console.log(selectedVariety)
      const docRef = doc(db, "products", sgproducts.id);
       /**/
      useEffect(() => {
       getDoc(docRef).then((data)=> {
         const values = data.data() 
         if(values)
         setProductRating(values)
       })
      }, [])

      const setAvailableQuantity = (available)=>{
        setDoc(ref,{
          available:available
        },{merge:true})
        .then(()=>{console.log("Available quantity set");setShowModal(false)})
        .catch((e)=>console.log(e))
      }

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
              <div style={{width:'100%',display:'flex',flexWrap:'wrap',maxWidth:1200,justifyContent:'center'}}>      
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
              
                      <h2>{sgproducts.name}</h2>
                      {productRating?
                      <Rating allowHalfIcon ratingValue={productRating.rating/20.0} readonly size={25} style={{width:'fit-content'}}/>:
                      <h3>This product has not been rated yet</h3>}
                      
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
                  <div>{
                    product &&
                    <>
                      <Button secondary onClick={()=> changeItemCount(-1) }>-</Button>
                       <Input onChange={(e)=>{+e.target.value>product.available?setQty(product.available):setQty(+e.target.value)}} 
                                onBlur={()=>{qty >product.available?setQty(product.available): qty<1?setQty(1):setQty(qty)}}                        
                        min={1} max={product.available} value={qty} type='number' style={{width:50,padding:8}}/>  
                      <Button secondary onClick={()=>changeItemCount(1)}>+</Button>
                      <span>{product?product.available+' available':'Available not set'}</span>
                      </>
                       }
                      <Button secondary onClick={()=>setShowModal(true)}>Set Available</Button>
                      <ProductSetting showModal={showModal} setShowModal={setShowModal} setAvailableQuantity={setAvailableQuantity}/>
                  </div>
                  <div style={{margin:'10px 0px',display:'flex',flexWrap:'wrap'}}>
                  <Button primary>Buy Now</Button>
                  <Errorwrapper>
                  <AddtoBagButton selectedVariety={selectedVariety}  user={user} db={db}/>
                  </Errorwrapper>
                  </div>  
                  
              </section>
              </div>
              <div style={{width:"100%",maxWidth:1200,display:'flex',flexWrap:'wrap'}}>
                <Review productName={sgproducts.name} productId={sgproducts.id} user={user}/>
              </div>
              </ProductWrapper>
      )
  }

  function AddtoBagButton({selectedVariety,user,db}){

    
    const { status, data: signInCheckResult } = useSigninCheck();
    const auth = useAuth();
    console.log(signInCheckResult)

    const addCart = (cartUser)=>{
      console.log('cart user',cartUser)
      setDoc(doc(db, "carts",cartUser.uid), {
          user:cartUser.uid,
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
        .then(({user}) => {
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
      console.log(user.uid)
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
    
  if(status=='success'){
      if(!user)
      return(
          <Button secondary onClick={addToBag}>Add To Bag</Button>
      )
      else if(signInCheckResult.signedIn&&user.uid) return <AddToBag/>
      else return <div>Loading...</div>
    }
    else if(status == 'loading')
       <div>Loading...</div>
    else
    <div>Something went wrong...</div>
  }

  function ProductSetting({setAvailableQuantity,showModal,setShowModal}){
   return(
     <ModalComponent showModal={showModal} setShowModal={setShowModal}>
        <Formik
        initialValues={{available:''}}
       
        onSubmit={(values, { setSubmitting }) => {
          console.log(values)
          setTimeout(() => {
            setAvailableQuantity(values.available)
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting,setFieldValue,handleChange,values }) => (
          <Form style={{width:'500px',display:'flex',flexWrap:'wrap'}}>
              
            <InputWrapper style={{minWidth:'100%'}}>
                <Label for='name' > Available</Label>
                <Input min={1} onChange={handleChange} value={values.available} name="available" type='number' style={{width:50,padding:8}}/> 
            </InputWrapper>
            <Btn secondary onClick={()=>setShowModal(false)} type='button'
              style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >CANCEL</Btn>
            <Btn primary type='submit'  disabled={isSubmitting}
              style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >DONE</Btn>
          </Form>
        )}
      </Formik>
     </ModalComponent>
   )
  }