import React from 'react'
import {useFirestore,useFirestoreCollectionData} from 'reactfire'
import { collection,query,orderBy} from "firebase/firestore";
import { OrderCard } from './orders';
import { Button } from './navbar';

export default function AdminCustomers() {
    const firestore = useFirestore();
    const ordersCollection = collection(firestore, 'orders');
    const ordersQuery = query(ordersCollection, orderBy('orderCreated', 'desc'));
    const { status, data:orders } = useFirestoreCollectionData(ordersQuery);
    console.log(orders)
    return (
        <div>
            {orders.map((order)=>
             <OrderCard order={order}>
                 <Button>
                     Dispatch
                 </Button>
             </OrderCard>             
            )}
        </div>
    )
}
