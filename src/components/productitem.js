import React, { useState,useRef, useEffect } from 'react'
import pomade from '../images/shea-butter.png'
import styled from 'styled-components'
import { Button } from './navbar'
import AddressForm from './addressform'
import  ModalComponent from './modal'
import {Helmet} from "react-helmet";
import { Formik, Form, ErrorMessage, validateYupSchema } from 'formik';
import AddressCard from './addresscard';
import { useUser,useSigninCheck,useFirebaseApp, useFirestore, useFirestoreCollectionData,SuspenseWithPerf} from 'reactfire'
import { collection,where,query,orderBy } from 'firebase/firestore'
import { ErrorBoundary } from "react-error-boundary";
import { Loading } from '../pages/verification/[reference]'
import Errorwrapper from './errorwrapper'
import { CardItem } from './addresscard'
import { Addresses } from './settings'
import * as Yup from 'yup'
import { verifyPaystack } from '../helperfunctions/cloudfunctions'

const bigProduct={
    width:'200px',
    height:'200px',
    objectFit:'contain',
}

const ProductImageWrapper= styled.div`
   display:flex;
   flex-wrap:wrap;
   position:relative;
   width:fit-content;
   max-width:fit-content;
   text-align:center;
   padding:20px;
   justify-content:center;
`
const ProductLabels = styled.div`
   width:150px;
`
export default function ProductItem({name,subName,price,imgSrc}) {
   
    return (
                
                    <ProductImageWrapper>
                    <img style={bigProduct} src={imgSrc}/>
                    <ProductLabels>{name}</ProductLabels>
                    <ProductLabels>{subName}</ProductLabels>
                    <ProductLabels>{price}</ProductLabels>
                    </ProductImageWrapper>
    )
}
