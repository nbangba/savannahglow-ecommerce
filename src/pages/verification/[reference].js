import React,{useState,useEffect} from 'react'
import Layout from "../../components/layout"
import  '../../styles/global.css'
import styled from 'styled-components'

const axios = require('axios');

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



export default function Verification({reference}) {
  console.log(reference)
  const options = {
    baseURL: 'https://api.paystack.co',
    url: `/transaction/verify/${reference}`,
    method: 'get',
    proxy:{port:443},
    headers: {
      Authorization: 'Bearer sk_test_968aa6f94eb55fc9f9c9a99c7d922890d9fcc4e1'
    }
  }

    const [payStackData, setpayStackData] = useState(null)
    
    useEffect(() => {
        axios.request(options).then((response) => {
          setpayStackData(response.data);
          console.log(response)
        });
      },[]);

      if(!payStackData)
      return(
          <Layout>
            <CenterChild>
              <Loading />
            </CenterChild>
          </Layout>
      )

    return (
        <Layout>
          <CenterChild>
            <h1>
              Your transaction was a {payStackData.data.status}
            </h1>
          </CenterChild>  
        </Layout>
    )
}
