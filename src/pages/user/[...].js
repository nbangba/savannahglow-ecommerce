import React, { useState } from "react"
import { Router } from "@reach/router"
import Layout from "../../components/layout"
import Profile from "../../components/userprofile"
import Home from "../../components/home"
import styled from 'styled-components'
import { MenuContentList,MenuContent } from "../../components/popper"
import { Link } from "gatsby"
import Settings from "../../components/settings"
import Orders from "../../components/orders"
import { doc, getFirestore } from 'firebase/firestore';
import {  useFirebaseApp } from 'reactfire';
import AdminOrders from "../admin/orders"
import AdminUsers from "../admin/users"
import PrivateRoute,{PrivateRouteAdmin,PrivateRouteAdmin12} from "../../components/privateroutes"
import Errorwrapper from "../../components/errorwrapper"
import OrderComponent from "../../components/order"

const SideMenu = styled.div`
  display:flex;
  width:150px;
  border-radius:5px;
  height:fit-content;
  padding: 20px;
  background:#e5cfc1;
  margin: 0 10px;
  box-sizing:border-box;
  align-content:center;
`
const subMenuItems =['Profile','History','Settings','Sign Out']

const User = styled.div`
  display:flex;
  flex: 1 1;
  justify-content:center;
`


const App = (props) => {
  const firestoreInstance = getFirestore(useFirebaseApp());
  return (
    
    <Layout>
        <User>
        {/*<SideMenu>
          <MenuContent>
                {subMenuItems.map(item=> <MenuContentList padding='10px' >
                                        <Link to={`/user/${item.toLowerCase()}`} activeStyle={{fontWeight:'bold',background:'#dbb7a1',borderRadius:4 }}>{item}</Link>
                                        </MenuContentList>)}
            </MenuContent>
        </SideMenu>*/}
        <Errorwrapper>
      <Router basepath="/user" style={{width:'100%'}}>
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/settings" component={Settings} />
        <PrivateRoute path="/orders" component={Orders} />
        <PrivateRoute path={`order/${props.id}`} component={OrderComponent} />
        <PrivateRoute path="admin/orders" component={AdminOrders} />
        <PrivateRoute path="admin/users" component={AdminUsers} />
        <Home path="/" />
      </Router>
      </Errorwrapper>
      </User> 
    </Layout>
  )
}

export default App