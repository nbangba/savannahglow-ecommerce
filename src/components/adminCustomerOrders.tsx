import React,{useEffect, useState} from 'react'
import {useFirestore,useFirestoreCollectionData,useAuth,useUser, ObservableStatus} from 'reactfire'
import { collection,query,orderBy,setDoc,doc,serverTimestamp,where,limit,startAt,endAt, addDoc, Timestamp} from "firebase/firestore";
import { OrderCard } from './orders';
import { Button } from './navbar';
import ModalComponent from './modal';
import Select from 'react-select';
import styled from 'styled-components';
import CreatableSelect from 'react-select/creatable';
import useRole from '../hooks/useRole';
import QueryOptions from './queryOptions';
import { VarietyProps } from './product';
import { AddressInfoProps } from './addressform';
import { User } from 'firebase/auth';

const moment = require('moment')

const TA = styled.div`
    display: block;
    width: 100%;
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
`
const AdminOrders = styled.div`
   display:flex;
   flex-wrap:wrap;
   justify-content:center;
   max-width:1400px;
   margin:auto;
`

interface OrderProps{
    amount:number,
    items: VarietyProps[],
    orderAddress: AddressInfoProps,
    payment:string,
    paystackOptions:string,
    NO_ID_FIELD:string,
}

export interface OrderInfoProps{
  order:OrderProps,
  orderCreated:Timestamp,
  orderStatus:string,
  orderID:number,
  user:string,
  response:any,
  reasonsDeliveryFailed?:string[],
  dispatchTime?:Timestamp,
  dispatcherHistory?:{label:string,uid:string}[]
  NO_ID_FIELD:string,
}

interface OrderInfoWithInvoice extends OrderInfoProps{
  receiptID?:never,
  invoiceID:number,
}

interface OrderInfoWithReceipt extends OrderInfoProps{
   receiptID:number,
   invoiceID?:never,
 }

export type OrderInfoWithReceiptOrInvoice = OrderInfoWithInvoice|OrderInfoWithReceipt

export default function  AdminCustomers() {
    const firestore = useFirestore();
    const { data: user } = useUser()
    const ordersCollection = collection(firestore, 'orders');
    const ordersQuery = query(ordersCollection, orderBy('orderCreated', 'desc'),limit(1));
    const currentTime = new Date(0)
    const {role} = useRole()
    const [orderStatus, setOrderStatus] = useState<string|null>('all')
    const [orderDate, setOrderDate] = useState<Date|null>(currentTime)
    const [queryOptions, setqueryOptions] = useState(ordersQuery)
    const [desc, setdesc] = useState(true)
    const { status, data:orders } = useFirestoreCollectionData(queryOptions) as ObservableStatus<OrderInfoWithReceiptOrInvoice[]>;
    const ORDERS_PER_PAGE = 12;
    const [page,setPage] = useState(1)
    console.log('role',role)

    useEffect(() => {
        console.log(orderDate)
        if(orderStatus == 'all' && (role =='admin 1' || role =='admin 2'))
        setqueryOptions(query(ordersCollection, orderBy('orderCreated',desc? 'desc':'asc'),
        where('orderCreated','>=',orderDate),limit(page*ORDERS_PER_PAGE)))

        else if(user && role=='dispatch')
        setqueryOptions(query(ordersCollection, orderBy('orderCreated',desc? 'desc':'asc'),
        where('orderStatus','==',orderStatus),where('dispatcher.uid','==',user.uid),
        where('orderCreated','>=',orderDate),limit(page*ORDERS_PER_PAGE)))

        else
        setqueryOptions(query(ordersCollection, orderBy('orderCreated',desc? 'desc':'asc'),
        where('orderStatus','==',orderStatus),where('orderCreated','>=',orderDate),limit(page*ORDERS_PER_PAGE)))
    }, [orderStatus,role,page,orderDate])

    console.log(orders)
    
    const  delivered = (order:OrderProps,orderID:string) => {        
        setDoc(doc(firestore, "orders", orderID), {
            orderStatus:'delivered',
            deliveryTime:serverTimestamp(),
          },{merge:true})
          .then(()=>{
            addDoc(collection(firestore,'mail'),{
                to:['nbangba.la@gmail.com'],
                template: {
                    name:'orderStatus',
                    data:{
                        ...order,
                        orderStatus:'delivered'
                    }
                  }
            }) 
              console.log('Order delivered')})
          .catch((e)=>console.log(e))
    }

  
   
  if(role && role != 'none')
  return (
   <div>
       <QueryOptions setOrderStatus={setOrderStatus} setOrderDate={setOrderDate}/>
       <AdminOrders>
       {orders.map((order:OrderInfoWithReceiptOrInvoice)=>
        <OrderCard order={order} role={role} key= {order.NO_ID_FIELD}>
            {(order.orderStatus != 'cancelled' && order.orderStatus != 'delivered') ?
            <>
            {(role && user && order.orderStatus == 'dispatched')?
            <>
              <Delivery order={order} user={user}/>
              <Button onClick={()=>delivered(order.order,order.NO_ID_FIELD)}>
                  Delivered    
              </Button>
            </>:
            <>
            {(role != 'dispatch') &&
             <Dispatch order={order}/>
            }
            </>
            }
            </>:
            <></>
           }       
        </OrderCard>             
       )}
       </AdminOrders>
       <LoadMore numberOfItems={orders.length}  setPage={setPage} ORDERS_PER_PAGE={ORDERS_PER_PAGE}/>
   </div>
  )
  else 
  return(
    <div>
        You are not authorized to view this page
    </div>
  )
}

interface DeliveryProps{
    order:OrderInfoProps,
    user:User,
}

function Delivery({order,user}:DeliveryProps){
    const firestore = useFirestore();
    
    const [selected, setselected] = useState<any>([])
    const options =[{label:'Couldnt reach customer'},{label:'Wrong Order'},{label:'Other'}]
    const [showModal, setshowModal] = useState(false)

    const onDeliveryFailed =(order:OrderInfoProps,selected:any)=>{
        const failedReason = {reason:selected.label,loggedBy:user.displayName,uid:user.uid}
        const newReasonDeliveryFailed = order.reasonsDeliveryFailed?[failedReason,...order.reasonsDeliveryFailed]:
                                           [failedReason]                                  
        setDoc(doc(firestore, "orders", order.NO_ID_FIELD), {
            orderStatus:'received',
            reasonsDeliveryFailed:newReasonDeliveryFailed,
            failedDeliveryTime:serverTimestamp(),
          },{merge:true})
          .then(()=>{console.log('Order dispatched')})
          .catch((e)=>console.log(e))
    }
    
    useEffect(() => {
        console.log(selected)
    }, [selected])
    
    return(
        <>
        <Button onClick={()=>setshowModal(true)}>
                Delivery Failed
              </Button>
    <ModalComponent showModal={showModal}>
        <div style={{minHeight:300}}>
       <CreatableSelect
       styles={{container: base => ({
        ...base,
        flex: '1 1 200px',
        maxWidth:500,
        minWidth: 200,
      })}}
       className="basic-single"
       classNamePrefix="select"
       isClearable={true}
       options={options}
       placeholder={'Enter a reason(less than 50 letters)'}
       onChange={setselected}
       />
       <div style={{width:'100%',textAlign:'center',marginTop:100}}>
           <Button style={{display:'initial'}} primary onClick={()=>{onDeliveryFailed(order,selected);setshowModal(false)}}>Submit</Button>
           <Button style={{width:'100px'}} secondary onClick={()=>setshowModal(false)}>Cancel</Button>
       </div>
       </div>
    </ModalComponent>
    </>
    )
}
interface DispatchProps{
    order:OrderInfoProps,
}
function Dispatch({order}:DispatchProps){
    const [selected, setselected] = useState<any>([])
    const firestore = useFirestore();
    const usersCollection = collection(firestore, 'users');
    const usersQuery = query(usersCollection,where('deleted','==',false),where('role','==','dispatch'))
    const { status, data:users } = useFirestoreCollectionData(usersQuery);

    const options = users && users.map((user)=>{return {label:user.displayName,uid:user.uid}})

    const [showModal, setshowModal] = useState(false)

    const  onDispatch = (order:OrderInfoProps,dispatcher:{label:string,uid:string|null}) => {
        
        const newDispatcherHistory = order.dispatcherHistory?[dispatcher,...order.dispatcherHistory]:
                                    [dispatcher]
        console.log(order,dispatcher,newDispatcherHistory)                         
        setDoc(doc(firestore, "orders", order.NO_ID_FIELD), {
            orderStatus:'dispatched',
            dispatchTime:serverTimestamp(),
            dispatcher:dispatcher,
            dispatcherHistory:newDispatcherHistory,
          },{merge:true})
          .then((r)=>{
              console.log('result',r)
            addDoc(collection(firestore,'mail'),{
                to:['nbangba.la@gmail.com'],
                template: {
                    name:'orderStatus',
                    data:{
                        ...order.order,
                        orderStatus:'dispatched'
                    }
                  }
            }) 
            console.log('Order dispatched',r)})
          .catch((e)=>console.log(e))
    }

    useEffect(() => {
        console.log(selected)
    }, [selected])
    
    const handleChange = (selected:any) =>{
      if(selected.uid)
      setselected(selected)
      else
      setselected({label:selected.label,uid:null})
    }

    return(
        <>
         <Button onClick={()=>setshowModal(true)}>
                Dispatch
            </Button>
    <ModalComponent showModal={showModal}>
       <CreatableSelect
       styles={{container: base => ({
        ...base,
        flex: '1 1 ',
        maxWidth:500
      })}}
       className="basic-single"
       classNamePrefix="select"
       isClearable={true}
       options={options}
       placeholder={'Search or Enter a dispatch name'}
       onChange={handleChange}
       />
       <div style={{width:'100%',textAlign:'center'}}>
           <button onClick={()=>{onDispatch(order,selected)}}>Submit</button>
       <button onClick={()=>setshowModal(false)}>Cancel</button>
       </div>
    </ModalComponent>
    </>
    )
}

interface SetPage{
    (prev:number):number;
}

interface LoadMoreProps{
    numberOfItems:number;
    setPage:(param:SetPage)=>void ;
    ORDERS_PER_PAGE:number
}
export function LoadMore({numberOfItems,setPage,ORDERS_PER_PAGE}:LoadMoreProps){
    if(numberOfItems == 0)
    return <div style={{width:'100%',display:'flex',justifyContent:'center',fontFamily:'Montserrat'}}> No Results</div>
    if(numberOfItems%ORDERS_PER_PAGE == 0)
    return(
        <div style={{width:'100%',display:'flex',justifyContent:'center',fontFamily:'Montserrat'}}>
        <Button secondary onClick={()=>setPage((prev:number)=> prev+1)} >Load more</Button>
        </div>
    )
    return <div style={{width:'100%',display:'flex',justifyContent:'center',fontFamily:'Montserrat'}}> End of results</div>
}

