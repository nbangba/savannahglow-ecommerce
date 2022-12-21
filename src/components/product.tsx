import React, { useState,useEffect } from 'react'
import styled from 'styled-components'
import { Button } from './navbar'
import { useUser,useSigninCheck,useFirestore ,useAuth,useFirestoreDocData, ObservableStatus, SigninCheckResult} from 'reactfire'
import { serverTimestamp,doc, setDoc,updateDoc,increment,arrayUnion,getDoc, DocumentData, Firestore, FieldValue, FieldPath} from "firebase/firestore";
import { Auth, signInAnonymously, User } from "firebase/auth";
import Errorwrapper from './errorwrapper';
import Review from './review';
import ModalComponent from './modal';
import { Formik,Form } from 'formik';
import { InputWrapper,Label,Input ,Button as Btn} from './addressform';
import { Rating } from 'react-simple-star-rating'
import { Link,navigate } from 'gatsby';
import useRole from './useRole';

const product ={
  width:'100px',
  height:'100px'
}

const bigProduct={
  minWidth:'200px',
  objectFit: 'cover',
  width:'auto',
  maxHeight:400,
} as React.CSSProperties

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
  cursor:pointer;
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

   .discount{
     display:flex;
     flex-wrap:wrap;
      span{
        margin: 0 2px;
        flex: 1 0 150px;
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
interface ProductProps{
  name:string,
  id:string,
  description:{description:string},
  varieties:VarietyProps[]
}

interface ContentfulProductProps{
  data:{contentfulProduct:ProductProps}
}

export interface VarietyProps{
  name:string,
  price:number,
  discount:number,
  id:string, 
  quantity:number,
  images:{fluid:{src:string,srcset:string}}[],
  total:number,
}
export default function Product({data}:ContentfulProductProps) {
    
    const db = useFirestore()
    const sgproducts = data.contentfulProduct
    const { status, data: signInCheckResult } = useSigninCheck();
    const auth = useAuth();
    const { role} = useRole()
    console.log(sgproducts)
      const [selectedVariety,setSelectedVariety] = useState<VarietyProps>(sgproducts.varieties[0])
      const [productRating,setProductRating] = useState<number|null>(null)
      const [selectedImage,setSelectedImage]=useState(0)
      const [qty,setQty] = useState(1)
      const [showModal, setShowModal] = useState(false)
      const firestore = useFirestore();
      const ref = doc(firestore, 'product',selectedVariety.id );
      const { data: product} = useFirestoreDocData(ref) as ObservableStatus<ProductSettingProps>;
      const { data: user } = useUser()
      console.log(selectedVariety)
      const docRef = doc(db, "products", sgproducts.id);

       /**/
      useEffect(() => {
       getDoc(docRef).then((data)=> {
         const productValues = data.data()
         if(productValues && productValues.rating)
         setProductRating(productValues.rating)
       })
      }, [])

      const setProductSettings = (settings:ProductSettingProps)=>{
        setDoc(ref,{
          ...settings
        },{merge:true})
        .then(()=>{console.log("Available quantity set");setShowModal(false)})
        .catch((e)=>console.log(e))
      }

      useEffect(() => {
        setSelectedImage(0)
      }, [selectedVariety.id])
      
      const changeItemCount = (changeQty:number) =>{
       if(qty+changeQty > product.available)
        setQty(product.available)
       else if((qty+changeQty) < 1) 
         setQty(1)
       else
        setQty(prev=>prev+changeQty)
      }
      
      useEffect(() => {
       setSelectedVariety(prev=> {return {...prev,quantity:qty}})
      }, [qty])
      
      const buyNow =()=>{
        if(!signInCheckResult.signedIn){
          signInAnonymously(auth)
          .then(({user}) => {
            setDoc(doc(db, "buyNow",user.uid), {
              user:user.uid,
              items:[selectedVariety],
              numberOfItems:qty,
              dateCreated:serverTimestamp(),
            })
            .then(()=>{
              navigate('/checkout',{state:{fromFeed:true}})
            })
           })
          }
          else if(user && user.uid)
          setDoc(doc(db, "buyNow",user.uid), {
            user:user.uid,
            items:[selectedVariety],
            numberOfItems:qty,
            dateCreated:serverTimestamp(),
          })
          .then(()=>{
            navigate('/checkout',{state:{fromFeed:true}})
          })
        }

      return(
            <ProductWrapper>
            <div style={{width:'100%',display:'flex',flexWrap:'wrap',maxWidth:1200,justifyContent:'center'}}>      
            <section>
                  <Selected>
                      <ProductImageWrapper>
                      <img style={bigProduct} src={selectedVariety.images[selectedImage].fluid.src} srcSet={selectedVariety.images[selectedImage].fluid.srcset}/>
                      <ul>{selectedVariety.images.map((image,index)=>
                          <li onClick={()=>setSelectedImage(index)}><img src={image.fluid.src} srcSet={image.fluid.srcset} className={`selectable`}/> </li>
                        )}
                      </ul>
                      </ProductImageWrapper>
                  </Selected>
              </section>
              <section>
              
                      <h2>{sgproducts.name}</h2>
                      {productRating?
                      <Rating allowHalfIcon ratingValue={productRating/20.0} readonly={true} size={25} style={{width:'fit-content'}}/>:
                      <small>This product has not been rated yet</small>}
                      
                      <hr></hr>
                      <div className='description'>{sgproducts.description.description}</div>
                      <hr></hr>
                      {product.discount?
                        <div className='discount'>
                          <span ><small>now: </small><span className='price'>{`GHS ${(selectedVariety.price-product.discount).toFixed(2)}`}</span></span>
                          <span><small>was:</small><span style={{textDecoration:'line-through'}}>{`GHS ${selectedVariety.price.toFixed(2)}`}</span></span>
                          <span><small>save:</small>{`GHS ${(product.discount).toFixed(2)} (${((product.discount*100)/selectedVariety.price).toFixed(2)}%)`}</span>
                        </div>:
                       <div className='description price'>{`GHS ${selectedVariety.price.toFixed(2)}`}</div>
                      }
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
                      <Button secondary onClick={()=> changeItemCount(-1) } style={{width:50}}>-</Button>
                       <Input onChange={(e)=>{+e.target.value>product.available?setQty(product.available):setQty(+e.target.value)}} 
                                onBlur={()=>{qty >product.available?setQty(product.available): qty<1?setQty(1):setQty(qty)}}                        
                        min={1} max={product.available} value={qty} type='number' style={{width:50,padding:8}}/>  
                      <Button secondary onClick={()=>changeItemCount(1)} style={{width:50}}>+</Button>
                      <span>{product?product.available+' available':'Available not set'}</span>
                      </>
                       }
                      
                      {(user && role == 'admin 1' || role =='admin 2') &&
                      <>
                      <Button secondary onClick={()=>setShowModal(true)}>Set Available</Button>
                      <ProductSetting showModal={showModal} price={selectedVariety.price} setShowModal={setShowModal} setProductSettings={setProductSettings} product={product}/>
                      </>
                      }
                  </div>
                  <div style={{margin:'10px 0px',display:'flex',flexWrap:'wrap'}}>
                  <Link to="/checkout/" state={{fromFeed:true}}>
                    <Button primary onClick={()=>buyNow()}>Buy Now</Button>
                  </Link>
                  <Errorwrapper>
                  <AddtoBagButton selectedVariety={selectedVariety}  user={user} db={db} status={status} signInCheckResult={signInCheckResult} auth={auth}/>
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
interface AddToBagProps{
  selectedVariety:VarietyProps,
  user:User|null,
  db:Firestore,
  signInCheckResult:SigninCheckResult,
  auth:Auth,
  status:string
}
  function AddtoBagButton({selectedVariety,user,db,signInCheckResult,auth,status}:AddToBagProps){
    
    
    console.log(signInCheckResult)

    const addCart = (cartUser:User)=>{
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
      console.log(user&&user.uid)
      const cartRef = doc(db, 'carts', user?user.uid:'NO_USER');
      const { data:cart } = useFirestoreDocData(cartRef);
      
      const addToBag = () =>{
      if(signInCheckResult.signedIn && user && !cart){
         addCart(user)
      }
      else if (cart){    
          const findIndexOfVariety = cart.items.findIndex((item:VarietyProps)=> item.name == selectedVariety.name)
          console.log('index',findIndexOfVariety)
          if(findIndexOfVariety > -1){
             const newItems = [...cart.items]
             newItems[findIndexOfVariety].quantity += selectedVariety.quantity
              console.log('newitems',newItems)
            if(user && user.uid)
              setDoc(doc(db,"carts",user.uid), {
                items:newItems,
              },{merge:true})
              .then(()=>
                updateDoc(doc(db,"carts",user.uid), {
                    numberOfItems:increment(selectedVariety.quantity)
                })
                .then(()=> console.log("quantity increased")) 
                .catch((e)=>console.log(e))
              )
              .then(()=> console.log('an item quantity increased'))
              .catch((e)=>console.log(e))

              else{
                console.log("User not found ",user)
              }  
          }
          else{
          if(user && user.uid)
            updateDoc(doc(db,"carts",user.uid), {
                items:arrayUnion(selectedVariety),
                numberOfItems:increment(selectedVariety.quantity)
              })
              .then(()=> console.log('address updated'))
            .catch((e)=>console.log(e))
          else{
            console.log("User not found ",user)
          }  
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
      else if(signInCheckResult.signedIn&&user&&user.uid) return <AddToBag/>
      else return <div>Loading...</div>
    }
    else if(status == 'loading')
      return <div>Loading...</div>
    else
    return <div>Something went wrong...</div>
  }

  interface ProductSettingModalProps{
    showModal:boolean,
    setShowModal:(showModal:boolean)=>void,
    setProductSettings:(settings:ProductSettingProps)=>void,
    product:ProductSettingProps,
    price:number
  }

  interface ProductSettingProps {
    available:number,
    discount:number;
  }

  function ProductSetting({setProductSettings,showModal,setShowModal,product,price}:ProductSettingModalProps){
    const {available=0,discount=0}= product
    return(
      <ModalComponent showModal={showModal} setShowModal={setShowModal}>
          <Formik
          initialValues={{available:available,discount:discount}}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values)
            setTimeout(() => {
              setProductSettings(values)
              setSubmitting(false);
            }, 400);
          }}
        >
          {({isSubmitting,setFieldValue,handleChange,values}) => (
            <Form style={{width:'500px',display:'flex',flexWrap:'wrap'}}>  
              <InputWrapper style={{minWidth:'100%'}}>
                  <Label htmlFor='available' > Available</Label>
                  <Input min={1} onChange={handleChange} value={values.available} name="available" type='number' style={{width:50,padding:8}}/> 
              </InputWrapper>
              <InputWrapper style={{minWidth:'100%'}}>
                  <Label htmlFor='discount' > Discount</Label>
                  <Input min={0} max={price} step="0.01" onChange={handleChange} value={values.discount} name="discount" type='number' style={{width:50,padding:8}}/> 
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