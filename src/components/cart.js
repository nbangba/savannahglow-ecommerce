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
import { calculateSubTotal,calculateDiscountedSubTotal,calculateTotalDiscount } from '../helperfunctions';

const CartWrapper = styled.div`
display:flex;
flex-wrap:wrap;
position:relative;
justify-content:flex-start;
max-width:1200px;
margin: 0px auto;
.mobileV{
    flex: 1 0 300px;
    @media only screen and (max-width: 750px) {
        flex: 1 0 100%;
        margin:0px;
        order:2;
       }
    }
`
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
  margin:2vw;
  flex-wrap:wrap;
  justify-content:flex-start;
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

export default function CartComponent({location}){
    return(
        <CartItems location={location}>
            {(cart,location)=> <Subtotal cart={cart} location={location}/>}
        </CartItems>
    )
}
export function CartItems({children,location}) {
    const [subtotal,setSubtotal] = useState(0)
    const [discountedSubTotal, setDiscountedSubTotal] = useState(0)
    const [totalDiscount,setTotalDiscount] = useState(0)
    const db = useFirestore()
    const { data: user } = useUser()
    const { status, data: signInCheckResult } = useSigninCheck();
    const auth = useAuth();
    console.log(location)
    
    const LoggedInCart = ({collection})=> {
        const cartRef = user && doc(db, collection, user.uid);
        const { data:cart } = useFirestoreDocData(cartRef);
        
        const items = cart && cart.items
        
        //consider moving to cartItem
        const deleteCartItem = (index,quantity)=> {
            const currentItems = [...items]
            currentItems.splice(index,1)
            const newQuantity = currentItems.reduce((prev,cur)=>prev+cur.quantity,0)
            setDoc(doc(db,collection,user.uid), {
                items:currentItems,
                numberOfItems: newQuantity,
                totalAmount:calculateSubTotal(currentItems),
                discountedTotal: calculateDiscountedSubTotal(currentItems),
                totalDiscount:calculateTotalDiscount(currentItems),
              },{merge:true})
              .then(()=>console.log('Cart item deleted'))
              .catch((e)=>console.log(e))
        }
        
        //consider moving to cartItem
        const updateCart = (index,quantity)=>{
            const currentItems = [...items]
            currentItems[index].quantity = quantity
            currentItems[index].total= quantity*currentItems[index].price
            const newQuantity = currentItems.reduce((prev,cur)=>prev+cur.quantity,0)
            console.log(currentItems)
            setDoc(doc(db, collection, user.uid), {
                items:currentItems,
                numberOfItems: newQuantity,
                totalAmount:calculateSubTotal(currentItems),
                discountedTotal: calculateDiscountedSubTotal(currentItems),
                totalDiscount:calculateTotalDiscount(currentItems),
              },{merge:true})
              .then(()=>console.log('Cart updated'))
              .catch((e)=>console.log(e))
        }
     
        const updateDiscount = (index,discount) =>{
            const currentItems = [...items]
            currentItems[index].discount = discount
            currentItems[index].total = ((currentItems[index].price-discount)*currentItems[index].quantity).toFixed(2)
            setDoc(doc(db,collection, user.uid), {
                items:currentItems,
                totalAmount:calculateSubTotal(currentItems),
                discountedTotal: calculateDiscountedSubTotal(currentItems),
                totalDiscount:calculateTotalDiscount(currentItems),
              },{merge:true})
              .then(()=>console.log('Discount updated'))
              .catch((e)=>console.log(e))
        }

        useEffect(() => {
            if(items ){
                setSubtotal(calculateSubTotal(items))
                setTotalDiscount(calculateTotalDiscount(items))
                setDiscountedSubTotal(calculateDiscountedSubTotal(items))
            }
        }, [cart])

       if(location || items && items.length > 0)
       return (
        <CartWrapper>
        <Card maxWidth='900px' className='mobileV' style={{margin:'10px 0px'}}>
        <ProductImageWrapper>           
        <ul>
            {
                items.map(((item,index)=> <CartItem key={index}index={index} item={item} updateDiscount={updateDiscount} updateCart={updateCart} 
                deleteCartItem={deleteCartItem} db={db}/>))
            }
        </ul>
        {
            location &&location.state.items?
        <div style={{width:'100%',textAlign:'right'}}></div>:
        <div style={{width:'100%',textAlign:'right'}}>{`Subtotal: GHS ${cart.discountedTotal}`}</div>
        }
        </ProductImageWrapper>
        </Card>
        {children && children(cart,location)}
        </CartWrapper>
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
    else return <LoggedInCart collection={location &&location.state.fromFeed?'buyNow':'carts'}/>
}

function CartItem({item,updateCart,index,deleteCartItem,db,updateDiscount}){
    const imgSrc = item.images[0].fluid.src
    const qtyRef = useRef()
    const [qty,setQty] = useState(parseInt(item.quantity))
    const [deleteDialog,setDeleteDialog] = useState(false)
    
    const availableRef = doc(db,'product',item.id)
    const { status, data:product } = useFirestoreDocData(availableRef);
    const thereIsQty = window.localStorage.getItem('quantity');
    console.log(product.available)
    const increaseItems = ()=>{
        if((qty+1) <= product.available)
        setQty((prev)=> prev+1)
    }

    const decreaseItems = ()=>{
        if((qty-1)> 0)
       setQty((prev)=> prev-1)
    }

    useEffect(() => {
        console.log(thereIsQty)
        if(thereIsQty){
        window.localStorage.setItem('quantity', qty);
        }
    }, [qty]);

   useEffect(() => {
        if(updateDiscount && product.discount != item.discount)
         updateDiscount(index,product.discount)
       }, [product])
   //add useeffect to check if item quantity is below set quantity
   useEffect(() => {
    }, [item])

   return(
       <>
       <li>
           <Remove style={{top:-15,}} onClick={()=>setDeleteDialog(true)}/>
           <DeleteDialog showModal={deleteDialog}  setShowDialog={setDeleteDialog} deleteItem={deleteCartItem}
            title='Are you sure you want to delete this item?' />
           <div style={{margin:10,flex:'0 0 200px'}}><img src={imgSrc}/></div>
       <div>    
       <CartLabel><h3 style={{marginTop:0}}>Savannah Glow Shea Butter</h3></CartLabel>
       <CartLabel>{item.name}</CartLabel>
       {
           product.discount?
           <>
           <CartLabel><span style={{color:'gray',textDecoration:'line-through'}}>{`GHS ${(item.price).toFixed(2)}`}</span></CartLabel>
           <CartLabel><span >{`GHS ${(item.price-product.discount).toFixed(2)}`}</span></CartLabel>
           </>:
           <CartLabel>{`GHS ${(item.price).toFixed(2)}`}</CartLabel>
       }
       <CartLabel>
           <Button type="button" style={{width:50}} secondary onClick={decreaseItems}>-</Button>
           <Input onChange={(e)=>{+e.target.value>product.available?setQty(product.available):setQty(+e.target.value)}} 
                  onBlur={()=>{qty >product.available?setQty(product.available): qty<1?setQty(1):setQty(qty)}}                         
           min={1} max={product.available} value={qty} type='number' style={{width:50,padding:8}}/>
           <Button type="button" style={{width:50}} secondary onClick={increaseItems}>+</Button>
           {(updateCart && qty != item.quantity) && <Button type="button" onClick={()=>updateCart(index,qty)}>Update Cart</Button>}
       </CartLabel>
       <CartLabel>
           {`Item Total: GHS ${((item.price-product.discount)*qty).toFixed(2)}`}
       </CartLabel>
       </div>
       </li>
       <hr></hr>
       </>
   )
}

function Subtotal({cart}){
    return( 
        <Card style={{position:'sticky',top:20,alignContent:'flex-start',maxHeight:200,fontFamily:`'Montserrat', sans-serif`}}>
            <div style={{width:"100%",padding:20}}>{`Subtotal(${cart.numberOfItems} items): GHS ${cart.discountedTotal}`}</div>
            <Button primary style={{minWidth:"fit-content",width:300}}>
                <Link style={{textDecoration:'none',color:'white'}} to='/checkout'> Check Out</Link>
            </Button>
        </Card>  
    )
}