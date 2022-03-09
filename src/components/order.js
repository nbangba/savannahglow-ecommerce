import React from 'react'
import CardComponent from './card'
import { doc, getFirestore,collection,query,orderBy,where, limit} from 'firebase/firestore';
import { useUser,useFirestoreCollectionData, useFirestore,useFirestoreDocData} from 'reactfire';
import { CardItem } from './addresscard'
import Errorwrapper from './errorwrapper';
import { leadingZeros } from '../helperfunctions';
import { CardActionArea } from '@material-ui/core';

const moment = require('moment')

export default function OrderComponent({id}) {
    const firestore = useFirestore()
    const  orderRef = doc(firestore,'orders',id) 
    const { status, data: order } = useFirestoreDocData(orderRef);
    console.log(order)
    return (
        <div>
        <CardComponent>
            
            <CardItem>
                {moment.unix(order.orderCreated.seconds).calendar(null,{sameElse:'DD/MM/YY [at] hh:mm a'})}
              </CardItem>
              <CardItem>
              <span style={{fontWeight:'bold'}}>Order Id: </span>
                {leadingZeros(5,order.orderID)}
              </CardItem>
              {
                order.orderStatus == 'delivered'?
             <>
                <CardItem>
                    <span style={{fontWeight:'bold'}}> Order status</span>: {order.orderStatus}
                </CardItem>
                <CardItem>
                <span style={{fontWeight:'bold'}}>Delivered At</span>: {moment.unix(order.deliveryTime.seconds).calendar(null,{sameElse:'DD/MM/YY [at] hh:mm a'})}
                </CardItem>
                <CardItem>
                <span style={{fontWeight:'bold'}}>Deliver To</span>:<div>{order.order.orderAddress.firstname} {order.order.orderAddress.lastname}</div> 
                <div>{order.order.orderAddress.location}</div>
                <div>{order.order.orderAddress.phone}</div>
              </CardItem>
                <CardItem>
                <span style={{fontWeight:'bold'}}> Delivered By:</span> {order.dispatcher.label}
                </CardItem>
              </>
              :
              <>
              <CardItem>
              <span style={{fontWeight:'bold'}}> Order status</span>: {order.orderStatus}
              </CardItem>
              <CardItem>
                <span style={{fontWeight:'bold'}}>Deliver To</span>:<div>{order.order.orderAddress.firstname} {order.order.orderAddress.lastname}</div> 
                <div>{order.order.orderAddress.location}</div>
                <div>{order.order.orderAddress.phone}</div>
              </CardItem>
              </>
              } 
              {
                  order.reasonsDeliveryFailed && 
                  <CardItem>
                      <div>
                      {`${order.reasonsDeliveryFailed.length} failed attempt(s)`}
                      </div>
                      <ul>
                      {order.reasonsDeliveryFailed.map((reason)=> <li>{reason.reason}</li>)}
                      </ul>
                      
                  </CardItem>
              }
              {order.order.items.map(item=> 
                                       <CardItem>
                                        <CardItem style={{fontWeight:'bold'}}>Savannah Glow</CardItem> 
                                        <div style={{display:'flex'}}>
                                         <img style={{width:100,objectFit:'contain'}} src={item.images[0].fluid.src}/>
                                         <CardItem>
                                         <CardItem>{item.name} </CardItem>
                                         {item.discount?
                                            <>
                                             <CardItem >
                                                 <span>
                                                <span style={{fontWeight:'bold'}}><small>Original</small> Price: </span>
                                                <span style={{textDecoration:'line-through',color:'gray'}}>{'GHS '+item.price.toFixed(2)}</span>
                                                </span>
                                             </CardItem>
                                             <CardItem>
                                                 <span>
                                               <span style={{fontWeight:'bold'}}><small>Discounted</small> Price: </span>
                                               <span >{'GHS '+(item.price-item.discount).toFixed(2)}</span>
                                               </span>
                                             </CardItem>
                                             </>
                                             :
                                             <CardItem>
                                                 <span>
                                               <span style={{fontWeight:'bold'}}>Price:</span>
                                               <span style={{textDecoration:'line-through',color:'gray'}}>{' GHS '+(item.price-item.discount).toFixed(2)}</span>
                                               </span>
                                             </CardItem>
                                           }
                                           
                                           <CardItem>
                                               <span>
                                           <span style={{fontWeight:'bold'}}>Qty: </span>
                                               <span >{item.quantity}</span>
                                               </span>
                                           </CardItem>
                                           <CardItem>
                                               <span>
                                              <span style={{fontWeight:'bold'}}>Sub Total: </span>
                                              <span style={{textDecoration:'strike-through'}}>{'GHS '+((item.price-item.discount)*item.quantity).toFixed(2)}</span>
                                              </span>
                                             </CardItem>
                                        </CardItem>
                                        </div>
                                       </CardItem>
                                      )}
              <CardItem><span style={{fontWeight:'bold'}}>Total</span>: GHS {order.order.amount}</CardItem>
        </CardComponent>
        </div>
    )
}
