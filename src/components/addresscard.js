import React, { Children, useState } from 'react'
import Card from './card'
import styled from 'styled-components'
import RemoveIcon from '../images/remove.svg'
import Edit from '../images/edit.svg'
import { Button } from './navbar'
import ModalComponent from './modal'
import AddressForm from './addressform'
import {doc,deleteDoc,getFirestore,setDoc } from "firebase/firestore";
import {useFirebaseApp,useSigninCheck,useUser} from 'reactfire';


export const CardItem = styled.div`
  display:flex;
  width:100%;
  padding:2px;
  margin:2px;
  font-family:'Montserrat', sans-serif;
  font-weight:400;
  color:#35486F;
  overflow: hidden;
  flex-wrap:wrap;
`

 export const Remove =styled(RemoveIcon)`
   position:absolute;
   top:10px;
   right:10px;
   width:20px;
   height:20px;
   fill:#474E52;
   cursor:pointer;
   &:hover{
       fill:black;
   }
`


export default function AddressCard({addressInfo,children,selected,setSelected,selectable,maxWidth,style}) {
    
    const {firstname='',lastname='',email='',phone='',location='',street='',city='',state='',country=''} = addressInfo
    
    return (
        <Card selected ={selected} maxWidth={maxWidth} selectable={selectable} addressInfo={addressInfo} style={style} setSelected={setSelected} >
            
            <CardItem>{firstname} {lastname}</CardItem>
            <CardItem>{email}</CardItem>
            <CardItem>{phone}</CardItem>
            <CardItem>{location}</CardItem>
            {children}
        </Card>
    )
}

export function AddressCardOptions({setDefaultAddress,defaultAddress,addressInfo}){
    const [showDeletDialog,setShowDeleteDialog] = useState(false)
    const [editAddress,setEditAddress]= useState(false)
    
    const isDefault = addressInfo.isDefault
    
    console.log(defaultAddress)

    const db = getFirestore(useFirebaseApp())
    const deleteItem = ()=> deleteDoc(doc(db, "addresses", addressInfo.NO_ID_FIELD))
                      .then(()=>console.log("Address  deleted"))
                      .catch((e)=>console.log(e))
    
    const addressRef = doc(db, 'addresses', addressInfo.NO_ID_FIELD);                  
    
    const setAsDefault = ()=> {
      if(defaultAddress){
        const defaultAddressRef = doc(db, 'addresses', defaultAddress)
        setDoc(defaultAddressRef, { isDefault: false }, { merge: true })
        .then(()=>setDefaultAddress(null))
        .then(()=>setDoc(addressRef, { isDefault: true }, { merge: true })
                .then(()=>console.log(addressInfo.NO_ID_FIELD,'now default'))
                .catch((e)=>console.log(e))
        )
      }
      else{
        setDoc(addressRef, { isDefault: true }, { merge: true })
        .then(()=>console.log(addressInfo.NO_ID_FIELD,'now default'))
        .catch((e)=>console.log(e))
      }

    }
  return(
   <>
   <Remove onClick={()=>setShowDeleteDialog(true)} />
   <CardItem>
    <Button secondary onClick={()=>setEditAddress(true)}><Edit fill='#474E52' style={{width:20,height:20}}/>edit</Button> 
    {isDefault?<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>default</div>:
    <Button secondary onClick={setAsDefault}>set as default</Button>}
  </CardItem>
  <ModalComponent showModal={editAddress}>
      <AddressForm setShowModal={setEditAddress} addressInfo={addressInfo}/>
  </ModalComponent>
  <DeleteDialog setShowDialog={setShowDeleteDialog} deleteItem={deleteItem} showModal={showDeletDialog} />
   </>
  )
}

export function DeleteDialog({setShowDialog,deleteItem,showModal,title}){
  return(
    <ModalComponent showModal={showModal}>
    <div>
      <div>{title}</div>
      <Button primary onClick={()=>{deleteItem(); setShowDialog(false)}} >YES</Button>
      <Button  secondary  onClick={()=>setShowDialog(false)}>NO</Button>
    </div>
    </ModalComponent>
  )
}