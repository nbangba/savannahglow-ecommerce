import React, { useState,useRef, useEffect } from 'react'
import pomade from '../images/shea-butter.png'
import styled from 'styled-components'
import { Button } from './navbar'
import AddressForm from './addressform'
import  ModalComponent from './modal'
import {Helmet} from "react-helmet";

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

export default function BuyComponent() {
    const [small, setSmall] = useState({product:'small',quantity:2,price:2,available:100})
    const [big, setBig] = useState({product:'big',quantity:3,price:4,available:100})
    const [currentItem,setCurrentItem]= useState(big)
    const [showModal, setShowModal] = useState(false)
    useEffect(() => {
        setCurrentItem(small)  
    }, [small])

    useEffect(() => {
        setCurrentItem(big) 
    }, [big])
    

  
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
               <Button secondary onClick={()=> setShowModal(true)}>Add Address</Button>
               <ModalComponent showModal={showModal} setShowModal={setShowModal}>
                   <AddressForm setShowModal={setShowModal}/>
               </ModalComponent>

               <Button primary style={{width:'fit-content', marginTop:20}}onClick={()=>payWithPaystack()}>Make Payment</Button>
               </OrderWrapper>
            </section> 
        </Buy>
    )
}


function payWithPaystack() {
    var handler = window.PaystackPop.setup({
        key: 'pk_test_64cadcb7dfa0a05f73626432160213f40c80c77c', // Replace with your public key
        email: 'nbangba.la@gmail.com',
        amount: 10, // the amount value is multiplied by 100 to convert to the lowest currency unit
        currency: 'GHS', // Use GHS for Ghana Cedis or USD for US Dollars
        callback: function(response) {
        //this happens after the payment is completed successfully
        var reference = response.reference
        console.log(response)
        window.location = "http://localhost:8000/verification/" + response.reference;
        alert('Payment complete! Reference: ' + reference);
        // Make an AJAX call to your server with the reference to verify the transaction
        },
        onClose: function() {
        alert('Transaction was not completed, window closed.');
        },
    });
    handler.openIframe();
    }

 