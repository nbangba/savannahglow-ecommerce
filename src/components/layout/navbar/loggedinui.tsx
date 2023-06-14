import React, { useEffect, useState } from 'react'
import {
    useUser,
    useSigninCheck,
    useFirestore,
    useFirestoreDocData,
    useAuth,
} from 'reactfire'
import styled, { css } from 'styled-components'
import User from '../../../images/svgs/user.svg'
import SignIn from '../../signin'
import ModalComponent from '../../supportingui/modal'
import ShoppingBag from '../../../images/svgs/bag.svg'
import { doc } from '@firebase/firestore'
import useRole from '../../../hooks/useRole'
import Errorwrapper from '../../errorwrapper'
import { Link, navigate } from 'gatsby'
import { Button, Menu, MenuItem } from './index'
import Popper, { MenuContent, MenuContentList } from '../../supportingui/popper'

const UserWrapper = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(224, 193, 175, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.3s ease-out;

    &:hover {
        background: rgba(224, 193, 175, 0.9);
    }
`
const CartNumber = styled.div`
    position: absolute;
    display: flex;
    width: 30px;
    height: 30px;
    top: 1%;
    cursor: pointer;

    color: #3f3633;
    justify-content: center;
    align-items: flex-end;
    font-weight: bold;
`

export default function LoginStatus() {
    const [showModal, setshowModal] = useState(false)
    const { status: userStatus, data: user } = useUser()
    const { status: signInstatus, data: signInCheckResult } = useSigninCheck()
    console.log(user)
    console.log(signInstatus, signInCheckResult)
    const firestore = useFirestore()

    const [open, setOpen] = useState(false)

    const CartComponent = () => {
        const cartRef = doc(firestore, 'carts', user ? user.uid : 'nocart')
        const { status: cartStatus, data: cart } = useFirestoreDocData(cartRef)
        console.log('cart', cart)
        return (
            <Errorwrapper>
                <CartNumber>
                    <Link to="/user/cart">
                        <small>
                            {cart && cart.numberOfItems
                                ? cart.numberOfItems
                                : '0'}
                        </small>
                    </Link>
                </CartNumber>
            </Errorwrapper>
        )
    }
    return (
        <Errorwrapper>
            <Menu left>
                <MenuItem>
                    {user ? (
                        <CartComponent />
                    ) : (
                        <CartNumber>
                            <small>0</small>
                        </CartNumber>
                    )}
                    <ShoppingBag
                        fill="#474E52"
                        style={{ width: 30, height: 30 }}
                    />
                </MenuItem>
                {signInstatus === 'success' && (
                    <>
                        {signInCheckResult &&
                        signInCheckResult.signedIn === true &&
                        user &&
                        !user.isAnonymous ? (
                            <Popper
                                open={open}
                                setOpen={setOpen}
                                popperContentUI={<SignedInPopperContent />}
                            >
                                {(setReferenceElement: any) => (
                                    <MenuItem
                                        ref={setReferenceElement}
                                        tabIndex={-1}
                                        onClick={() => setOpen(!open)}
                                    >
                                        <UserWrapper>
                                            <User
                                                fill="#474E52"
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                }}
                                            />
                                        </UserWrapper>
                                    </MenuItem>
                                )}
                            </Popper>
                        ) : (
                            <MenuItem>
                                <Button
                                    primary
                                    onClick={() => navigate('/user/signin')}
                                >
                                    Sign In
                                </Button>
                            </MenuItem>
                        )}
                    </>
                )}

                <ModalComponent showModal={showModal}>
                    <SignIn />
                    <button onClick={() => setshowModal(false)}>close</button>
                </ModalComponent>
            </Menu>
        </Errorwrapper>
    )
}

function SignedInPopperContent() {
    const { role } = useRole()
    const auth = useAuth()
    const subMenuItems = ['Profile', 'Orders', 'Settings']
    const signOut = () => {
        auth.signOut().then(() => {
            console.log('you are signed out')
        })
    }

    return (
        <MenuContent>
            {subMenuItems.map((item, index) => (
                <MenuContentList key={index}>
                    <Link to={`/user/${item.toLowerCase()}`}>{item}</Link>
                </MenuContentList>
            ))}
            {role && (
                <MenuContentList>
                    {role == 'admin 1' || role == 'admin 2'
                        ? 'ADMIN'
                        : 'DISPATCH'}
                    <MenuContent>
                        <MenuContentList>
                            <Link to={'/user/admin/orders'}>User Order</Link>
                        </MenuContentList>
                        {(role == '' || role == 'admin 2') && (
                            <MenuContentList>
                                <Link to={'/user/admin/users'}>Users</Link>
                            </MenuContentList>
                        )}
                    </MenuContent>
                </MenuContentList>
            )}
            <MenuContentList
                key={4}
                onClick={signOut}
                style={{ cursor: 'pointer' }}
            >
                Sign Out
            </MenuContentList>
        </MenuContent>
    )
}
