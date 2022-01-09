import React,{useState,useEffect} from 'react'
import { Card } from './card'
import { useUser,useSigninCheck,useFirestoreDocData, useFirestore, useFirestoreCollectionData,SuspenseWithPerf} from 'reactfire'
import { collection,where,query,doc,orderBy} from 'firebase/firestore'
import styled from 'styled-components'
import { CartItems } from './cart'
import { Button } from './navbar'
import momo from '../images/momo.jpg'
import paystack from '../images/paystack.png'
import Visa from '../images/visa.svg'
import Master from '../images/master.svg'
import { Addresses } from './settings'
import ModalComponent from './modal'
import * as Yup from 'yup'
import AddressForm from './addressform'
import AddressCard from './addresscard'
import { Formik, Form,Field, ErrorMessage, validateYupSchema } from 'formik';
import { CardItem } from './addresscard'
import { verifyPaystack } from '../helperfunctions/cloudfunctions'
import { calculateSubTotal } from '../helperfunctions'
import Cards from 'react-credit-cards'
import { chargeCard } from '../helperfunctions/cloudfunctions'
import 'react-credit-cards/es/styles-compiled.css';

const RadioButtonsContainer = styled.label`
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    height:fit-content;
    font-family: 'Montserrat', sans-serif;
    input{
        position: absolute;
        opacity: 0;
        cursor: pointer;
    }
    
    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: #eee;
        border-radius: 50%;
      }
      
    &:hover input ~ .checkmark {
    background-color: #ccc;
    }

    input:checked ~ .checkmark {
        background-color: #2196F3;
    }

    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
        top: 9px;
       left: 9px;
       width: 8px;
       height: 8px;
       border-radius: 50%;
       background: white;
   }

   input:checked ~ .checkmark:after {
    display: block;
  }
  
`

const CheckoutWrapper = styled.div`
   display:flex;
   flex-wrap:wrap;
   justify-content:center;
   max-width:1200px;
   margin:auto;
   #checkout{
       width:100%;
   }
   .checkout-form{
       width:100%;
       display:flex;
       flex-wrap:wrap;
       flex:1 0 300px;
   @media only screen and (max-width: 750px) {
    flex-wrap:wrap;
    flex:1 0 100%;
   }
  }
}
`

export default function Checkout() {
    
    const { status, data: signInCheckResult } = useSigninCheck();
    const { data: user } = useUser()
    const firestore = useFirestore();

    const [subtotal,setSubtotal] = useState(0)
    const cartRef = user && doc(firestore, 'carts', user.uid);
    const { data:cart } = useFirestoreDocData(cartRef);
    const items =cart && cart.items
    
    const cardsCollection = collection(firestore, 'cards');
    const cardsQuery = user && query(cardsCollection,where('owner','==',user.uid))
    const { data:cards } = useFirestoreCollectionData(cardsQuery);
    const card = (cards && cards[0]) && cards[0].authorization
    console.log(card)
    
    useEffect(() => {
        if(cart && cart.items )
        setSubtotal(calculateSubTotal(items))
        }, [cart])

    const addressesCollection = collection(firestore, 'addresses');
    const addressesQuery = query(addressesCollection,where('isDefault','==',true))
    const { status:info, data:addresses } = useFirestoreCollectionData(addressesQuery);    
    
    const orderSchema = Yup.object().shape({
    orderAddress: Yup.object().required('An address is required'),
    payment:Yup.string().required('Select a payment option')
    });

    return (
        <CheckoutWrapper >
            <div className='checkout-form'>
            <UserAddress address={addresses&&addresses[0]} />
            <Formik 
                initialValues={{orderAddress:addresses[0],payment:'paystack',paystackOptions:''}}
                validationSchema={orderSchema}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                      console.log('verifying')
                      values.amount = subtotal
                      values.items = [...items]
                      values.orderAddress = addresses[0]
                    console.log(JSON.stringify(values, null, 2));
                    if(values.paystackOptions=='defaultCard')
                    chargeCard({...values},cards[0].NO_ID_FIELD)
                    else if(values.payment=='paystack')
                    payWithPaystack({...values});
                    setSubmitting(false);
                  }, 400);
                }}>
                {({ isSubmitting,setFieldValue,handleChange,values,errors }) => (
                <Form id='checkout'>
                    
                    <PaymentSegment card={card} values={values}/>
                    <CartItems/> 
  
                </Form>
                )}
            </Formik>
            </div>
            <Subtotal cart={cart} subtotal={subtotal}/>
        </CheckoutWrapper>
    )
}


function UserAddress({address}){
    const [showModal, setShowModal] = useState(false)
    const [selected, setSelected] = useState(address)
    const [changeAddress, setchangeAddress] = useState(false)
    const { status, data: signInCheckResult } = useSigninCheck();
    const firestore = useFirestore();
    const addressesCollection = collection(firestore, 'addresses');
    const addressesQuery = query(addressesCollection,where('isDefault','==',true))
    const { status:info, data:addresses } = useFirestoreCollectionData(addressesQuery);
    
    console.log(addresses)
    
    
    
    return(
        <>
        {signInCheckResult&&signInCheckResult.signedIn && selected? 
               <>
               { 
               <AddressCard maxWidth='900px'  addressInfo={selected} style={{margin:'10px 0px'}}>
                   <CardItem>
                   <Button secondary onClick={()=>setchangeAddress(true)}>Change Address</Button>
                   </CardItem> 
               </AddressCard>
               }
              <ModalComponent showModal={changeAddress} >
                    <Addresses wrap selected={selected} setSelected={setSelected} selectable  />
                    <button onClick={()=>setchangeAddress(false)}>CLOSE</button>
              </ModalComponent>
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

function PaymentSegment({card,values}){
    
    return(
        <Card maxWidth='400px' style={{margin:'10px 0px',maxWidth:900}}>
            <div role='group' aria-labelledby="my-radio-group">
           <RadioButtonsContainer > 
               <div>
                   <img src={paystack}/>
                   <img src={momo}/>
                   <Visa/>
                   <Master/>
               </div>
                <Field type="radio" name="payment" value='paystack'/>
                <span class="checkmark"></span>
                {(card && values.payment == 'paystack') &&
                    <>
                    <RadioButtonsContainer> Mobile Money or New Card
                        <Field type="radio"  name="paystackOptions" value='momo'/>
                        <span class="checkmark"></span>
                        </RadioButtonsContainer>
                        <span class="checkmark" ></span>
                        <RadioButtonsContainer> 
                            <Cards  cvc='***'
                                    expiry={`${card.exp_month}/${card.exp_year}`} 
                                    name={card.account_name?card.account_name:'CARD HOLDER'}
                                    number={`${card.bin}******${card.last4}`} />
                        <Field type="radio"  name="paystackOptions" value='defaultCard'/>
                        <span class="checkmark"></span>
                    </RadioButtonsContainer>
                    </>
                   }
           </RadioButtonsContainer>
           <RadioButtonsContainer> Pay on delivery
             <Field type="radio" name="payment" value='POD'/>
             <span class="checkmark"></span>
           </RadioButtonsContainer>
           <div>payment: {values.payment}</div>
           <div>opyions: {values.paystackOptions}</div>
           </div>
        </Card>
    )
}

function Subtotal({cart,subtotal}){
    return(
      <Card style={{alignContent:'flex-start',maxHeight:200,fontFamily:`'Montserrat', sans-serif`}}>
        <div style={{width:"100%",padding:20}}>{`Subtotal(${cart.numberOfItems} items): GHS ${subtotal}.00`}</div>
        <button type='submit' form='checkout' primary style={{minWidth:"fit-content",width:300}}>Place Order</button>
      </Card>  
    )
}

function payWithPaystack(info) {
    var handler = window.PaystackPop.setup({
        key:`pk_test_64cadcb7dfa0a05f73626432160213f40c80c77c` , // Replace with your public key
        email: info.orderAddress.email,
        amount: info.amount*100, // the amount value is multiplied by 100 to convert to the lowest currency unit
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
