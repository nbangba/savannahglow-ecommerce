import React from 'react'
import Layout from '../components/layout'
import CheckoutComponent from '../components/checkout'
import Errorwrapper from '../components/errorwrapper'
import {Helmet} from "react-helmet";
import { getAnalytics, logEvent } from "firebase/analytics";

export default function Checkout({location}) {
    const analytics = getAnalytics();
    return (
        <Layout>
            <Helmet>
            <script src="https://js.paystack.co/v1/inline.js">
            </script>
            </Helmet>
            <Errorwrapper>
            <CheckoutComponent location ={location}/>
            </Errorwrapper>
        </Layout>
    )
}
