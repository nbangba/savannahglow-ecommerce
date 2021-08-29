import React, { useState } from 'react'
import Card from './card'
import styled from 'styled-components'
import RemoveIcon from '../images/remove.svg'
import Edit from '../images/edit.svg'
import { Button } from './navbar'
import ModalComponent from './modal'
import AddressForm from './addressform'
const CardItem = styled.div`
  display:flex;
  width:100%;
  padding:2px;
  font-family:'Montserrat', sans-serif;
  font-weight:400;
  color:#35486F;
`

const Remove =styled(RemoveIcon)`
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


export default function AddressCard({addressInfo}) {
    const [deleteAddress,setDeleteAddress] = useState(false)
    const [showDeletDialog,setShowDeleteDialog] = useState(false)
    const [editAddress,setEditAddress]= useState(false)
    const {firstname='',lastname='',email='',phone='',location='',street='',city='',state='',country=''}= addressInfo
    return (
        <Card>
            <Remove />
            <CardItem>{firstname} {lastname}</CardItem>
            <CardItem>{email}</CardItem>
            <CardItem>{phone}</CardItem>
            <CardItem>{location}</CardItem>
            <CardItem>
              <Button secondary onClick={()=>setEditAddress(true)}><Edit fill='#474E52' style={{width:20,height:20}}/>edit</Button> 
              <Button secondary >set as default</Button>
            </CardItem>
            <ModalComponent showModal={editAddress}>
               <AddressForm setShowModal={setEditAddress} addressInfo={addressInfo}/>
            </ModalComponent>
        </Card>
    )
}
