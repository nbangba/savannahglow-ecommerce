import React from "react";
import Layout from "../components/layout";
import CheckoutComponent from "../components/checkout";
import Errorwrapper from "../components/errorwrapper";
import { Helmet } from "react-helmet";

export default function Checkout({ location }) {
  return (
    <>
      <Helmet>
        <script async src="https://js.paystack.co/v1/inline.js"></script>
      </Helmet>
      <Errorwrapper>
        <CheckoutComponent location={location} />
      </Errorwrapper>
    </>
  );
}
