import React,{useState} from "react"
import { navigate } from "gatsby"
import { useSigninCheck,useAuth } from 'reactfire'
import Errorwrapper from "./errorwrapper"
import useRole from "./useRole"

const PrivateRoute = ({ component: Component, location, ...rest }) => {
    const { status, data: signInCheckResult } = useSigninCheck();
  if ((signInCheckResult && signInCheckResult.signedIn !== true) && location.pathname !== `/signin`) {
    navigate("/signin")
    return null
  }

  return <Component {...rest} />
}

export const PrivateRouteAdmin = ({ component: Component, location, ...rest }) => {
  const { status, data: signInCheckResult } = useSigninCheck();
  const{role} =useRole()
  
if ((signInCheckResult && signInCheckResult.signedIn === true && !role) && location.pathname !== `/`) {
  navigate("/")
  return null
}

return <Component {...rest} />
}

export const PrivateRouteAdmin12 = ({ component: Component, location, ...rest }) => {
  const { status, data: signInCheckResult } = useSigninCheck();
  const{role} =useRole()

if ((signInCheckResult && signInCheckResult.signedIn === true && (role=='none'|| role=='dispatch')) && location.pathname !== `/`) {
  navigate("/")
  return null
}

return <Component {...rest} />
}

export default PrivateRoute