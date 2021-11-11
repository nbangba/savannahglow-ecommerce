import React from 'react'
import Layout from '../components/layout'
import BuyComponent from '../components/buy'
import {Helmet} from "react-helmet";
import { getAnalytics, logEvent } from "firebase/analytics";
export default function Order() {
    const analytics = getAnalytics();
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
