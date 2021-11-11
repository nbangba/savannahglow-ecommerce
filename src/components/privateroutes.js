import React from "react"
import { navigate } from "gatsby"
import { useSigninCheck } from 'reactfire'
import Errorwrapper from "./errorwrapper"

const PrivateRoute = ({ component: Component, location, ...rest }) => {
    const { status, data: signInCheckResult } = useSigninCheck();
  if ((signInCheckResult && signInCheckResult.signedIn !== true) && location.pathname !== `/signin`) {
    navigate("/signin")
    return null
  }

  return <Component {...rest} />
}

export default PrivateRoute