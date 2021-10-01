import React, { useEffect, useState,useRef} from 'react'
import { useUser,useSigninCheck,useFirestore ,useAuth,useFirestoreDocData} from 'reactfire'
import { doc, setDoc} from "firebase/firestore";
import styled from 'styled-components';
import { Button } from './navbar'
import {Card} from './card';
import {Remove} from './addresscard'
import { Input } from './addressform';
import { DeleteDialog } from './addresscard';
import { Link } from 'gatsby';

const ProductImageWrapper= styled.div`
 position:relative;
 text-align:center;
 box-sizing:border-box;
 display:flex;
 flex-wrap:wrap;
 width:100%;
 max-width:900px;

 font-family: 'Montserrat', sans-serif;
    color:#35486F;
    text-align:left;
 ul{
   display:flex;
   padding:0px;
   width:100%;
   flex-wrap:wrap;
 }

li{
  position:relative;
  display:flex;
  width:100%;
  margin:20px;
}
 
img{
    max-width:200px;
    object-fit:contain;
}
hr{
    border: 0;
    border-top: 1px solid #979aae;
    width:100%;
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
}

input[type=number] {
  -moz-appearance: textfield;
}
`
const CartLabel = styled.div`
  margin: 10px 0px;
`

export default function CartComponent(){
    return(
        <CartItems>
            {(cart,subtotal)=> <Subtotal cart={cart} subtotal={subtotal}/>}
        </CartItems>
    )
}
export function CartItems({children}) {
    const [subtotal,setSubtotal] = useState(0)
    
    const db = useFirestore()
    const { data: user } = useUser()
    const { status, data: signInCheckResult } = useSigninCheck();
    const auth = useAuth();
    console.log(signInCheckResult)
    
    

    
    const LoggedInCart = ()=> {
        const cartRef = user && doc(db, 'carts', user.uid);
        const { data:cart } = useFirestoreDocData(cartRef);
        
        const items =cart && cart.items
        
        const calculateSubTotal = ()=>{
            const reducer =(previousItem,currentItem)=> previousItem + (currentItem.price*currentItem.quantity)
        return items.reduce(reducer,0)
        }
        
        const deleteCartItem = (index,quantity)=> {
            const currentItems = [...items]
            currentItems.splice(index,1)
            const newQuantity = currentItems.reduce((prev,cur)=>prev+cur.quantity,0)
            setDoc(doc(db, "carts", user.uid), {
                items:currentItems,
                numberOfItems: newQuantity,
              },{merge:true})
              .then(()=>console.log('Cart item deleted'))
              .catch((e)=>console.log(e))
        }

        const updateCart = (index,quantity)=>{
            const currentItems = [...items]
            currentItems[index].quantity = quantity
            const newQuantity = currentItems.reduce((prev,cur)=>prev+cur.quantity,0)
            console.log(currentItems)
            setDoc(doc(db, "carts", user.uid), {
                items:currentItems,
                numberOfItems: newQuantity,
              },{merge:true})
              .then(()=>console.log('Cart updated'))
              .catch((e)=>console.log(e))
        }

        useEffect(() => {
        if(cart && cart.items )
        setSubtotal(calculateSubTotal())
        }, [cart])

       if(items && items.length>0) return (
        <div style={{display:"flex",}}>
        <Card maxWidth='900px'>
        <ProductImageWrapper>

        <ul>
            {
                items.map(((item,index)=> <CartItem key={index}index={index} item={item} updateCart={updateCart} 
                deleteCartItem={deleteCartItem}/>))
            }
        </ul>
        <div style={{width:'100%',textAlign:'right'}}>{`Subtotal: GHS ${subtotal}.00`}</div>
        </ProductImageWrapper>
        </Card>
        {children && children(cart,subtotal)}
        </div>

    )
    else return(
        <div>
            No items in your Cart
        </div>
    )
}
    if(!user){
        return(
            <div>
                No items in your Cart
            </div>
        )
    }
    else return <LoggedInCart/>
}

function CartItem({item,updateCart,index,deleteCartItem}){
    const imgSrc = item.images[0].fluid.src
    const qtyRef = useRef()
    const [qty,setQty] =useState(item.quantity)
    const [deleteDialog,setDeleteDialog] = useState(false)
    const increaseItems =()=>{
        if((qty+1)<= item.available)
        setQty((prev)=> prev+1)
    }

    const decreaseItems =()=>{
        if((qty-1)> 0)
        setQty((prev)=> prev-1)
    }

   return(
       <>
       <li>
           <Remove onClick={()=>setDeleteDialog(true)}/>
           <DeleteDialog showModal={deleteDialog}  setShowDialog={setDeleteDialog} deleteItem={deleteCartItem} />
           <div style={{margin:10}}><img src={imgSrc}/></div>
       <div>    
       <CartLabel><h3 style={{marginTop:0}}>Savannah Glow Shea Butter</h3></CartLabel>
       <CartLabel>{item.name}</CartLabel>
       <CartLabel>{`GHS ${item.price}.00`}</CartLabel>
       <CartLabel>
           <Button secondary onClick={decreaseItems}>-</Button>
           <Input onChange={(e)=>{+e.target.value>item.available?setQty(item.available):setQty(+e.target.value)}} 
                  onBlur={()=>{qty >item.available?setQty(item.available): qty<1?setQty(1):setQty(qty)}}                         
           min={1} max={item.available} value={qty} type='number' style={{width:50,padding:8}}/>
           <Button secondary onClick={increaseItems}>+</Button>
           {(qty != item.quantity) && <Button onClick={()=>updateCart(index,qty)}>Update Cart</Button>}
       </CartLabel>
       <CartLabel>
           {`Item Total: GHS ${item.price*item.quantity}.00`}
       </CartLabel>
       </div>
       </li>
       <hr></hr>
       </>
   )
}

function Subtotal({cart,subtotal}){
    return(
        <Card style={{alignContent:'flex-start',maxHeight:200,fontFamily:`'Montserrat', sans-serif`}}>
        <div style={{width:"100%",padding:20}}>{`Subtotal(${cart.numberOfItems} items): GHS ${subtotal}.00`}</div>
        <Button primary style={{minWidth:"fit-content",width:300}}><Link to='/checkout'> Check Out</Link></Button>
      </Card>  
    )
}