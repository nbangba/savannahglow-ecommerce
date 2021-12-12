import React from 'react'
import CardComponent from './card'
import { doc, getFirestore,collection,query,orderBy,where} from 'firebase/firestore';
import { useUser,useFirestoreCollectionData, useFirestore} from 'reactfire';
import { updateEmail,updatePassword,deleteUser} from 'firebase/auth'; // Firebase v9+
import { CardItem } from './addresscard'
import Errorwrapper from './errorwrapper';
import { leadingZeros } from '../helperfunctions';
import { calculateSubTotal } from '../helperfunctions';
import { Button } from './navbar';
import { refund } from '../helperfunctions/cloudfunctions';
import styled from 'styled-components';
import {pdf} from '@react-pdf/renderer';
import PDFDoc from './pdfdoc';
import { saveAs } from 'file-saver';
import { getAnalytics, logEvent } from "firebase/analytics";

const moment = require('moment')

const OrderWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`


export default function Orders(){
  const { data: user } = useUser()
  if(user)
  return(
    <Errorwrapper>
      <OrdersComponent user={user}/>
    </Errorwrapper>
  )

  return <div>No user</div>
}

function OrdersComponent({user}) {
  const firestore = useFirestore();
  //const { status, data: signInCheckResult } = useSigninCheck()
  const ordersCollection = collection(firestore, 'orders');
  const ordersQuery = user && query(ordersCollection,where('user', '==',user.uid),
                                                   orderBy('orderCreated','desc'))
  const { status, data:orders } = useFirestoreCollectionData(ordersQuery);
  console.log('orders',orders)
  if(orders.length>0)
    return (
      <OrderWrapper>
        {
          orders.map((order)=>
            <OrderCard order={order} role='owner'/>
          )
        }
      </OrderWrapper>
    )
  else
  return <div>nothing found</div>
}


export function OrderCard({order,role=null,children}){
  return(
    <CardComponent maxWidth="400px" style={{height:'fit-content'}}>
              <CardItem>
                {moment.unix(order.orderCreated.seconds).calendar(null,{sameElse:'DD/MM/YY [at] hh:mm a'})}
              </CardItem>
              <CardItem>
              <span style={{fontWeight:'bold'}}>Order Id: </span>
                {leadingZeros(5,order.orderID)}
              </CardItem>
              <CardItem>
              <span style={{fontWeight:'bold'}}> Order status</span>: {order.orderStatus}
              </CardItem>
              {order.order.items.map(item=> 
                                       <CardItem>
                                        <CardItem style={{fontWeight:'bold'}}>Savannah Glow</CardItem> 
                                        <div style={{display:'flex'}}>
                                         <img style={{width:100,objectFit:'contain'}} src={item.images[0].fluid.src}/>
                                         <CardItem>
                                        <CardItem>{item.name} </CardItem>
                                        <CardItem>{'GHS '+item.price +' * '+ item.quantity} </CardItem>
                                        </CardItem>
                                        </div>
                                        </CardItem>
                                      )}
              <CardItem><span style={{fontWeight:'bold'}}>Quantity</span>: 7</CardItem>     
              <CardItem><span style={{fontWeight:'bold'}}>Total</span>: GHS {calculateSubTotal(order.order.items)}</CardItem>     
              <CardItem>
                {(order.orderStatus =='received' &&  role != 'dispatch') && <Button secondary onClick={()=>refund(order.response.reference,(order.order.amount*100)+"")}>Cancel order</Button>} 
                {order.orderStatus !='cancelled' && <Button onClick={()=>generatePdfDocument(order,`sg-receipt-${leadingZeros(5,order.receiptID)}`)}>
                    Download Receipt
                </Button>}
               {children && children}
              </CardItem>                 
            </CardComponent>
      )
}

const generatePdfDocument = async (order,fileName) => {
  const blob = await pdf((
      <PDFDoc  order={order}/>
     )).toBlob();
  saveAs(blob,fileName);
};