
import React, { useState,useRef, useEffect } from 'react'
import pomade from '../images/shea-butter.png'
import styled from 'styled-components'
import { Button } from './navbar'
import AddressForm from './addressform'
import  ModalComponent from './modal'
import {Helmet} from "react-helmet";
import { Formik, Form, ErrorMessage, validateYupSchema } from 'formik';
import AddressCard from './addresscard';
import { useUser,useSigninCheck,useFirebaseApp, useFirestore, useFirestoreCollectionData,SuspenseWithPerf} from 'reactfire'
import { collection,where,query } from 'firebase/firestore'
import Errorwrapper from './errorwrapper'
import { CardItem } from './addresscard'
import { Addresses } from './settings'
import * as Yup from 'yup'
import { verifyPaystack } from '../helperfunctions/cloudfunctions'

const product ={
    width:'100px',
    height:'100px'
}

const bigProduct={
    width:'200px',
    height:'200px'
}

const ProductImageWrapper= styled.div`
   position:relative;
   width:fit-content;
   text-align:center;
`
const RemoveButton = styled(Button)`
  position:absolute;
  top:5px;
  right:5px;
`
const Buy = styled.div`
   display:flex;
   flex-wrap:wrap;
    width:1200px;
    margin:auto;
    background:#f8e4d6;
   section{
       width:50%;
       border:10px solid #f5d2a687;
       padding:20px;
       box-sizing:border-box;
       display:flex;
       justify-content:center;
   }
   span,h2,h3{
    width:100%;
    font-family: 'Montserrat', sans-serif;
    color:#35486F;
    text-align:left;
   }

   .selectable{
    width:100px;
    height:100px;
   }
   .highlight{
        border: 2px solid #35486F;
        box-shadow: 0 0 10px #9bb2e1;
   }

`

const Selected = styled.div`
  display:flex;
  flex-wrap:wrap;  
`

const OrderPrice= styled.div`
  display:flex;
 
  align-items:center;
  margin-top:20px;
  .price{
      display:inline-flex;
      text-align:right;
      justify-content:flex-start;
      flex:1 0 250px;

      span{
          width:80px;
          text-align:right;
      }
  }
`
const OrderWrapper = styled.div`
width:100%;
   max-width:400px;
`

const AddressesWrapper = styled.div`
   max-width:500px;
   overflow-x:scroll;

`

export default function BuyComponent() {
    const [small, setSmall] = useState({product:'small',quantity:2,price:2,available:100})
    const [big, setBig] = useState({product:'big',quantity:3,price:4,available:100})
    const [currentItem,setCurrentItem]= useState(big)
    

    useEffect(() => {
        setCurrentItem(small)  
    }, [small])

    useEffect(() => {
        setCurrentItem(big) 
    }, [big])
    

    const orderSchema = Yup.object().shape({
        orderAddress: Yup.object().required('An address is required'),
      });

    return (
        <Buy>
            <section>
                <Selected>
                <div id="map"></div>

                    <h2>In your basket</h2>
                    <ProductImageWrapper>
                    <div style={{fontFamily:`'Montserrat', sans-serif`,color:'#35486F'}}>{big.quantity}</div>
                    <img style={bigProduct} src={pomade}/>
                    <RemoveButton secondary>X</RemoveButton>
                    </ProductImageWrapper>
                    <ProductImageWrapper>
                    <div style={{fontFamily:`'Montserrat', sans-serif`,color:'#35486F'}}>{small.quantity}</div>
                    <img style={bigProduct} src={pomade}/>
                    <RemoveButton secondary>X</RemoveButton>
                    </ProductImageWrapper>
                </Selected>
                <div>
                    <h2>Select Item</h2>
                <img className={`selectable ${currentItem.product=='big'?'highlight':''}`} src={pomade} onClick={()=>{setCurrentItem(big)}}/>
                <img className={`selectable ${currentItem.product=='small'?'highlight':''}`}  src={pomade} onClick={()=>setCurrentItem(small)}/>
                {currentItem && 
                <div>
                    <Button secondary onClick={()=>currentItem.product=='small'? 
                    setSmall(prev=>{return {...prev,quantity:prev.quantity-1}}):
                    setBig(prev=>{return {...prev,quantity:prev.quantity-1}})} >-</Button>
                     <span>{currentItem.quantity}</span>   
                    <Button secondary onClick={()=>currentItem.product=='small'? 
                    setSmall(prev=>{return {...prev,quantity:prev.quantity+1}}):
                    setBig(prev=>{return {...prev,quantity:prev.quantity+1}})}>+</Button>
                    <span>{currentItem.available} available</span>
                </div>
                }
                </div>
                
            </section>
            <section>
                <Formik
                initialValues={{orderAddress:null}}
                validationSchema={orderSchema}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                      console.log('verifying')
                    console.log(JSON.stringify(values, null, 2));
                    payWithPaystack(values.orderAddress);
                    setSubmitting(false);
                  }, 400);
                }}>
                {({ isSubmitting,setFieldValue,handleChange,values,errors }) => (
                <Form>
                <OrderWrapper>
               <h2>Your Order</h2>
               <OrderPrice>
                 <span>{small.quantity} x small</span><div className='price'><span>$</span><span>{small.quantity*small.price}</span></div> 
               </OrderPrice>
               <OrderPrice>
                 <span>{big.quantity} x big</span><div className='price'><span>$</span><span>{big.quantity*big.price}</span></div> 
               </OrderPrice>
               <OrderPrice>
                   <h3>Total </h3>
                   <span className='price' style={{fontWeight:'bold',fontSize:18}}>
                       <span>$</span>
                       <span>{small.quantity*small.price+big.quantity*big.price}</span>
                   </span>
               </OrderPrice>
               <h3 >Address</h3>
               <Errorwrapper>
                   <UserAddress setFieldValue={setFieldValue}/>
               </Errorwrapper>
               <button type="submit" disabled={isSubmitting} style={{width:'fit-content', marginTop:20}}>Make Payment</button>
               {errors && errors.orderAddress}
               </OrderWrapper>
               </Form>
                )}
               </Formik>
            </section> 
        </Buy>
    )
}

function UserAddress({setFieldValue}){
    const [showModal, setShowModal] = useState(false)
    const [selected, setSelected] = useState(null)
    const [changeAddress, setchangeAddress] = useState(false)
    const { status, data: signInCheckResult } = useSigninCheck();
    const firestore = useFirestore();
    const addressesCollection = collection(firestore, 'addresses');
    const addressesQuery = query(addressesCollection,where('isDefault','==',true))
    const { status:info, data:addresses } = useFirestoreCollectionData(addressesQuery);
    
    console.log(addresses)
    
    
    useEffect(() => {
        if(addresses[0])
        setSelected(addresses[0])
    }, [])
    console.log(info,addresses)
    
    useEffect(() => {
        
        setFieldValue('orderAddress',selected)
    }, [selected])
    return(
        <>
        {signInCheckResult&&signInCheckResult.signedIn? 
               <>
               {selected &&
               <AddressCard  addressInfo={selected}>
                   <CardItem>
                   <Button secondary onClick={()=>setchangeAddress(!changeAddress)}>{changeAddress?'Done': 'Change'}</Button>
                   </CardItem> 
               </AddressCard>
               }
               {changeAddress && 
               <>
               <ChangeAddressOptions selected={selected} setSelected={setSelected}/> 
               </>
               }
               </>
                 :
                <>
               <Button secondary onClick={()=> setShowModal(true)}>Add Address</Button>
               <ModalComponent showModal={showModal} setShowModal={setShowModal}>
                <AddressForm setShowModal={setShowModal} setOrderAddress={setSelected}/>
               </ModalComponent>
                </>
             }
             
        </>
    )
}

function ChangeAddressOptions({selected,setSelected}){
    //add 'selectable' option to card component
    return(
        <>
         <CardItem><h3>Select Address</h3></CardItem>
       
           <Addresses selectable={true} selected={selected} setSelected={setSelected}/>
      
        </> 
    )
}



function payWithPaystack(info) {
    var handler = window.PaystackPop.setup({
        key:`${process.env.PAY_STACK_PUBLIC_KEY}` , // Replace with your public key
        email: 'nbangba.la@gmail.com',
        amount: 10, // the amount value is multiplied by 100 to convert to the lowest currency unit
        currency: 'GHS', // Use GHS for Ghana Cedis or USD for US Dollars
        callback: function(response) {
        //this happens after the payment is completed successfully
        var reference = response.reference
        console.log(response)
        verifyPaystack(info,response)
        
        alert('Payment complete! Reference: ' + reference);
        // Make an AJAX call to your server with the reference to verify the transaction
        },
        onClose: function() {
        alert('Transaction was not completed, window closed.');
        },
    });
    handler.openIframe();
}

 