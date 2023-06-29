import React, { lazy } from 'react'
import { Router } from '@reach/router'
import styled from 'styled-components'
import Errorwrapper from '../../components/errorwrapper'
import PrivateRoute from '../../components/privateroutes'
import loadable from '@loadable/component'
const Home = loadable(() => import('../../components/home'))
const Settings = loadable(() => import('../../components/settings/settings'))
const Orders = loadable(() => import('../../components/order/orders'))
const AdminOrders = loadable(() => import('../../components/admin/orders'))
const AdminUsers = loadable(() =>
    import('../../components/admin/userscomponent')
)
const Cart = loadable(() => import('../../components/cart'))
const Checkout = loadable(() => import('../../components/checkout'))
const SignIn = loadable(() => import('../../components/signin'))
const OrderComponent = loadable(() => import('../../components/order/order'))
const Profile = loadable(() => import('../../components/userprofile'))

const SideMenu = styled.div`
    display: flex;
    width: 150px;
    border-radius: 5px;
    height: fit-content;
    padding: 20px;
    background: #e5cfc1;
    margin: 0 10px;
    box-sizing: border-box;
    align-content: center;
`
const subMenuItems = ['Profile', 'History', 'Settings', 'Sign Out']

const User = styled.div`
    display: flex;
    flex: 1 1;
    justify-content: center;
`

const App = (props) => {
    console.log(props)
    return (
        <Errorwrapper>
            <Router basepath="/user" style={{ width: '100%' }}>
                <SignIn path="/signin" />
                <Cart path="/cart" />
                <Checkout path="/checkout" />
                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/settings" component={Settings} />
                <PrivateRoute path="/orders" component={Orders} />
                <PrivateRoute
                    path={`/orders/order/:id`}
                    component={OrderComponent}
                />
                <PrivateRoute path="/admin/orders" component={AdminOrders} />
                <PrivateRoute path="/admin/users" component={AdminUsers} />
                <Home path="/" />
            </Router>
        </Errorwrapper>
    )
}

export default App
