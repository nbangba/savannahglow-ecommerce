import React,{useEffect, useState} from 'react'
import {useFirestore,useFirestoreCollectionData,useAuth,useUser} from 'reactfire'
import { collection,query,orderBy,setDoc,doc,serverTimestamp,where} from "firebase/firestore";
import { OrderCard } from './orders';
import { Button } from './navbar';
import ModalComponent from './modal';
import Select from 'react-select';
import styled from 'styled-components';
import CreatableSelect from 'react-select/creatable';
import useRole from './useRole';

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
export default function  AdminCustomers() {
    const firestore = useFirestore();
    const { data: user } = useUser()
    const ordersCollection = collection(firestore, 'orders');
    const ordersQuery = query(ordersCollection, orderBy('orderCreated', 'desc'));
    const {role} = useRole()
    const [orderStatus, setorderStatus] = useState('all')
    const [queryOptions, setqueryOptions] = useState(ordersQuery)
    const [desc, setdesc] = useState(true)
    const { status, data:orders } = useFirestoreCollectionData(queryOptions);
    console.log('role',role)
    useEffect(() => {
        if(orderStatus == 'all')
        setqueryOptions(query(ordersCollection, orderBy('orderCreated',desc? 'desc':'asc')))
        else
        setqueryOptions(query(ordersCollection, orderBy('orderCreated',desc? 'desc':'asc'),where('orderStatus','==',orderStatus)))
    }, [orderStatus])

   useEffect(() => {
       if(role=='dispatch')
       setqueryOptions(query(ordersCollection, orderBy('orderCreated',desc? 'desc':'asc'),where('dispatcher.uid','==',user.uid)))
   }, [role])
    console.log(orders)
   
    
    const  delivered = (order) => {        
        setDoc(doc(firestore, "orders", order.NO_ID_FIELD), {
            orderStatus:'delivered',
            deliveryTime:serverTimestamp(),
          },{merge:true})
          .then(()=>console.log('Order delivered'))
          .catch((e)=>console.log(e))
    }

  
   
  if(role && role != 'none')
  return (
   <div>
       {orders.map((order)=>
        <OrderCard order={order} role={role} key={order.NO_ID_FIELD}>
            {(order.orderStatus != 'cancelled' && order.orderStatus != 'delivered') &&
            <>
            {(role && order.orderStatus == 'dispatched')?
            <>
              <Delivery order={order} user={user}/>
              <Button onClick={()=>delivered(order)}>
                  Delivered    
              </Button>
            </>:
            <>
            {(role != 'dispatch') &&
             <Dispatch order={order}/>
            }
            </>
            }
            </>
           }
        </OrderCard>             
       )}
   </div>
  )
  else 
  return(
    <div>
        You are not authorized to view this page
    </div>
  )
}

function Delivery({order,user}){
    const firestore = useFirestore();
    
    const [selected, setselected] = useState([])
    const options =[{label:'Couldnt reach customer'},{label:'Wrong Order'},{label:'Other'}]
    const [showModal, setshowModal] = useState(false)
    const onDeliveryFailed =(order,selected)=>{
        const failedReason = {reason:selected.label,loggedBy:user.displayName,uid:user.uid}
        const newReasonDeliveryFailed = order.reasonsDeliveryFailed?[failedReason,...order.reasonsDeliveryFailed]:
                                           [failedReason]                                  
        setDoc(doc(firestore, "orders", order.NO_ID_FIELD), {
            orderStatus:'received',
            reasonsDeliveryFailed:newReasonDeliveryFailed,
            failedDeliveryTime:serverTimestamp(),
          },{merge:true})
          .then(()=>console.log('Order dispatched'))
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
       placeholder={'Enter a reason(less than 50 letters)'}
       onChange={setselected}
       selected={selected}
       />
       <div style={{width:'100%',textAlign:'center'}}>
           <button onClick={()=>{onDeliveryFailed(order,selected);setshowModal(false)}}>Submit</button>
       <button onClick={()=>setshowModal(false)}>Cancel</button>
       </div>
    </ModalComponent>
    </>
    )
}

function Dispatch({order}){
    const [selected, setselected] = useState([])
    const firestore = useFirestore();
    const usersCollection = collection(firestore, 'users');
    const usersQuery = query(usersCollection,where('deleted','==',false),where('role','==','dispatch'))
    const { status, data:users } = useFirestoreCollectionData(usersQuery);

    const options =users && users.map((user)=>{return {label:user.displayName,uid:user.uid}})

    const [showModal, setshowModal] = useState(false)

    const  onDispatch = (order,dispatcher) => {
        
        const newDispatcherHistory = order.dispatcherHistory?[dispatcher,...order.dispatcherHistory]:
                                    [dispatcher]
        console.log(order,dispatcher,newDispatcherHistory)                         
        setDoc(doc(firestore, "orders", order.NO_ID_FIELD), {
            orderStatus:'dispatched',
            dispatchTime:serverTimestamp(),
            dispatcher:dispatcher,
            dispatcherHistory:newDispatcherHistory,
          },{merge:true})
          .then((r)=>console.log('Order dispatched',r))
          .catch((e)=>console.log(e))
    }

    useEffect(() => {
        console.log(selected)
    }, [selected])
    
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
       onChange={setselected}
       selected={selected}
       />
       <div style={{width:'100%',textAlign:'center'}}>
           <button onClick={()=>{onDispatch(order,selected)}}>Submit</button>
       <button onClick={()=>setshowModal(false)}>Cancel</button>
       </div>
    </ModalComponent>
    </>
    )
}