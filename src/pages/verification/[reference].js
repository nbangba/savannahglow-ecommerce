import React,{useState,useEffect} from 'react'
import Layout from "../../components/layout"
import  '../../styles/global.css'
import styled from 'styled-components'
import { Page, Text, View, Document, StyleSheet ,PDFViewer,Font} from '@react-pdf/renderer';
import { useUser,useSigninCheck,useFirestore ,useAuth,useFirestoreDocData} from 'reactfire'
import { doc, setDoc} from "firebase/firestore";
import Errorwrapper from '../../components/errorwrapper';
import { verifyPaystack } from '../../helperfunctions/cloudfunctions';
import PDFDoc from '../../components/pdfdoc';
import { getAnalytics, logEvent } from "firebase/analytics";

export const Loading = styled.div`
  width:100px;
  height:100px;
  border-radius:50%;
  background: conic-gradient(from 0deg,#35486F, #EBDDD2 );
  animation: rotate 2s infinite linear;
  
  @keyframes rotate {
    from {transform: rotate(0.0turn);}
    to {transform: rotate(1turn);}
  }
`
export const CenterChild = styled.div`
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    text-align:center;
    h1{
      min-width:100%;
      font-family: 'Montserrat', sans-serif;
      font-size:36px;
      font-weight:400;
      color:#35486F;
    }
`

export default function Verification({reference}){
  return(
    <Layout>
    <Errorwrapper>
      <VerificationComponent reference={reference}/>
    </Errorwrapper>
    </Layout>
  )
}

 function VerificationComponent({reference}) {
  console.log(reference)
 
    
  const analytics = getAnalytics();
      const db = useFirestore()
      const orderRef = doc(db, 'orders', reference);
      const { data:order } = useFirestoreDocData(orderRef);

      if(!order)
      return(
            <CenterChild>
              <Loading />
            </CenterChild>
      )

    return (
        
          <CenterChild>
            <h1 >
              Your transaction was a {order.response.status}
            </h1>
            <Errorwrapper>
            <Receipt order={order}/>
            </Errorwrapper>
          </CenterChild>  
        
    )
}


function Receipt({order}){


   console.log(order)
   if(order)
  return(
    <PDFViewer style={{width:500, height:500,border:0}}> 
      <PDFDoc order={order}/>
    </PDFViewer>
  )

  return<div>Loading receipt...</div>
}

