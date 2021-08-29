import React from 'react'
import Layout from '../components/layout'
import BuyComponent from '../components/buy'
import {Helmet} from "react-helmet";
export default function Order() {
    return ( 
        <Layout>
            <Helmet>
            <script src="https://js.paystack.co/v1/inline.js">
            </script>
            </Helmet>
           <BuyComponent/>
        </Layout>    
    )
}
