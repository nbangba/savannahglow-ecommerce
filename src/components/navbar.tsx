import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import Logo from '../images/svgs/logo.svg'
import User from '../images/svgs/user.svg'
import SignIn from './signin'
import Popper from './popper'
import ModalComponent from './modal'
import slugify from '@sindresorhus/slugify'
import {
    useUser,
    useSigninCheck,
    useFirestore,
    useFirestoreDocData,
    useFirebaseApp,
    useAuth,
} from 'reactfire'
import { doc, getDoc } from '@firebase/firestore'
import Errorwrapper from './errorwrapper'
import { graphql, Link, navigate, useStaticQuery } from 'gatsby'
import ShoppingBag from '../images/svgs/bag.svg'
import HamburgerIcon from '../images/svgs/hamburger-menu.svg'
import { getMessaging, getToken } from 'firebase/messaging'
import Drawer from './drawer'
import { MenuContent } from './popper'
import { MenuContentList } from './popper'
import useRole from '../hooks/useRole'
import { AccordionButton } from './settings'

const Navbar = styled.div`
    display: flex;
    width: 100%;
    height: auto;
    padding: 10px;
    box-sizing: border-box;
    z-index: 10;

    .desktop-menu {
        display: none;
        @media only screen and (min-width: 899.1px) {
            display: flex;
        }
    }

    .logoMobile {
        object-fit: cover;
        @media only screen and (max-width: 899px) {
            position: absolute;
            right: 55%;
            width: 80px;
            top: 5px;
        }
    }

    .tooltip-enter {
        opacity: 0;
    }

    .tooltip-enter-active {
        opacity: 1;
        transition: opacity 200ms;
    }

    .tooltip-exit {
        opacity: 1;
    }

    .tooltip-exit-active {
        opacity: 0;
        transition: opacity 200ms;
    }
`
export const Menu = styled.ul`
    position: relative;
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    padding: 0px;
    font-family: 'Ubuntu', sans-serif;
    margin: 0px;
    ${(props: { left?: boolean }) =>
        props.left &&
        css`
            justify-content: flex-end;
        `}
`

export const MenuItem = styled.li`
    position: relative;
    display: block;
    color: #35486f;
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    font-size: 1.2rem;
    font-weight: 500;
    box-sizing: border-box;
    padding-left: 30px;
    a {
        color: #35486f;
        box-sizing: border-box;
        width: 100%;
        display: inline-block;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
`
export const Button = styled.button`
    position: relative;
    color: #35486f;
    border: none;
    cursor: pointer;
    width: 100px;
    padding: 10px;
    margin: 5px;
    box-sizing: border-box;
    border-radius: 0.5rem;
    margin: 0 10px;
    font-family: 'Montserrat', sans-serif;
    text-align: center;
    &:hover {
        color: white;
        background: #13213d;
        transition: background 0.3s ease-out;
        mix-blend-mode: normal;
    }

    ${(props: { primary?: boolean; secondary?: boolean; onClick: () => any }) =>
        props.primary &&
        css`
            background-color: #062461;
            color: white;
            margin: 5px;
            min-width: fit-content;
            &:hover {
                color: white;
                background: #13213d;
                transition: background 0.3s ease-out;
                mix-blend-mode: normal;
            }
        `}

    ${(props) =>
        props.secondary &&
        css`
            background: rgba(224, 193, 175, 0.5);
            text-align: center;
            display: inline-flex;
            border-radius: 5px;
            width: 100px;
            margin: 5px;
            align-items: center;
            justify-content: center;
            min-width: fit-content;
            &:hover {
                color: #35486f;
                background-color: rgba(224, 193, 175, 0.8);
                font-weight: bold;
                transition: background 0.3s ease-out;
            }
        `}
`

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
const MenuIcon = styled.div`
    cursor: pointer;
    display: none;
    align-items: center;
    @media only screen and (max-width: 899px) {
        display: flex;
    }
`

interface NavProps {}
export default function Nav() {
    const [openDrawer, setOpenDrawer] = useState(false)
    const [loginUI, setLoginUI] = useState(<></>)
    const [productsLink, setProductsLink] = useState(
        <Link to="/products">Products</Link>
    )

    const menuItems: string[] = ['Home', 'Blogs', 'Faq']
    const [activeTab, setActiveTab] = useState('')
    const { allStrapiCategory } = useStaticQuery(
        graphql`
            query {
                allStrapiCategory {
                    nodes {
                        name
                        sub_categories {
                            name
                        }
                    }
                }
            }
        `
    )
    console.log(allStrapiCategory)
    const subMenuItems = allStrapiCategory.nodes

    useEffect(() => {
        setLoginUI(<LoginStatus />)
        setProductsLink(<ProductCategories />)
        const messaging = getMessaging()
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('./firebase-messaging-sw.js')
                .then(function (registration) {
                    console.log(
                        'Registration successful, scope is:',
                        registration.scope
                    )
                    getToken(messaging, {
                        vapidKey:
                            'BLfh0aam15mTS6B5Fn3p9J_9-IMZPJH7PnA6sCgNDAIalkNB84HMUYV1Nlnyy7MIjuvaOUqlmuTudwUGgU_AViE',
                    })
                        .then((currentToken) => {
                            if (currentToken) {
                                // Send the token to your server and update the UI if necessary
                                // ...
                                console.log(currentToken)
                            } else {
                                // Show permission request UI
                                console.log(
                                    'No registration token available. Request permission to generate one.'
                                )
                                // ...
                            }
                        })
                        .catch((err) => {
                            console.log(
                                'An error occurred while retrieving token. ',
                                err
                            )
                            // ...
                        })
                })
                .catch(function (err) {
                    console.log(
                        'Service worker registration failed, error:',
                        err
                    )
                })
        }
    }, [])

    return (
        <Navbar>
            <MenuIcon onClick={() => setOpenDrawer(true)}>
                <HamburgerIcon style={{ width: 40, height: 40, zIndex: 100 }} />
            </MenuIcon>
            <Drawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}>
                <MenuContent>
                    {menuItems.map((item: string, index: number) => (
                        <MenuContentList key={index}>
                            <Link
                                to={
                                    item === 'Home'
                                        ? '/'
                                        : `/${item.toLowerCase()}`
                                }
                            >
                                {item}
                            </Link>{' '}
                        </MenuContentList>
                    ))}
                    <MenuContentList
                        style={{ maxWidth: 190, boxSizing: 'border-box' }}
                    >
                        <Link to="/products/">Products</Link>
                        <MenuContent>
                            {subMenuItems.map((item: any, index: number) => (
                                <MenuContentList
                                    style={{
                                        width: '100%',
                                        maxWidth: '100%',
                                        paddingLeft: 20,
                                    }}
                                >
                                    <AccordionButton
                                        title={
                                            activeTab === item.name ? '-' : '+'
                                        }
                                        name={item.name}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        style={{
                                            padding: 6,
                                            width: 30,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        childComponent={
                                            <Link
                                                to={`/category/${slugify(
                                                    item.name
                                                )}/`}
                                                style={{
                                                    color: '#062461',
                                                    minWidth: 150,
                                                    maxWidth: 150,
                                                    width: 150,
                                                }}
                                            >
                                                {item.name}
                                            </Link>
                                        }
                                    >
                                        <MenuContent>
                                            {item.sub_categories.map(
                                                (subItem: any) => (
                                                    <MenuContentList
                                                        style={{
                                                            paddingLeft: 20,
                                                            fontWeight: 200,
                                                        }}
                                                    >
                                                        <Link
                                                            to={`/category/${slugify(
                                                                item.name
                                                            )}/${slugify(
                                                                subItem.name
                                                            )}`}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    </MenuContentList>
                                                )
                                            )}
                                        </MenuContent>
                                    </AccordionButton>
                                </MenuContentList>
                            ))}
                        </MenuContent>
                    </MenuContentList>
                </MenuContent>
            </Drawer>
            <div className="logoMobile">
                <Link
                    to="/"
                    style={{ display: 'inline-block', width: 'fit-content' }}
                >
                    <Logo style={{ width: 80, height: 80 }} />
                </Link>
            </div>
            <Menu className="desktop-menu" style={{ flexGrow: 10 }}>
                {menuItems.map((item: string, index: number) => (
                    <MenuItem key={index}>
                        <Link
                            to={
                                item === 'Home' ? '/' : `/${item.toLowerCase()}`
                            }
                        >
                            {item}
                        </Link>{' '}
                    </MenuItem>
                ))}
                <MenuItem>{productsLink}</MenuItem>
            </Menu>
            {loginUI}
        </Navbar>
    )
}

function LoginStatus() {
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
                    <Link to="/cart">
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
                                    onClick={() => navigate('/signin')}
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
                        {(role == 'admin 1' || role == 'admin 2') && (
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

function ProductCategories() {
    const { allStrapiCategory } = useStaticQuery(
        graphql`
            query {
                allStrapiCategory {
                    nodes {
                        name
                        sub_categories {
                            name
                        }
                    }
                }
            }
        `
    )
    console.log(allStrapiCategory)
    const subMenuItems = allStrapiCategory.nodes
    const [open, setOpen] = useState(false)

    const ProductsPopperContent = () => {
        return (
            <MenuContent
                style={{ maxWidth: 500, width: 500 }}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                {subMenuItems.map((item: any, index: number) => (
                    <MenuContentList
                        key={index}
                        color="#062461"
                        style={{
                            width: 'fit-content',
                            minWidth: 'fit-content',
                        }}
                    >
                        <Link
                            to={`/category/${slugify(item.name)}`}
                            style={{ color: '#062461' }}
                        >
                            {item.name}
                        </Link>
                        <MenuContent style={{ display: 'block' }}>
                            {item.sub_categories.map(
                                (subItem: any, index: number) => (
                                    <MenuContentList
                                        key={index}
                                        padding="0 0 0 10px"
                                    >
                                        <Link
                                            to={`/category/${slugify(
                                                item.name
                                            )}/${slugify(subItem.name)}`}
                                        >
                                            {subItem.name}
                                        </Link>
                                    </MenuContentList>
                                )
                            )}
                        </MenuContent>
                    </MenuContentList>
                ))}
            </MenuContent>
        )
    }
    return (
        <Popper
            open={open}
            setOpen={setOpen}
            popperContentUI={<ProductsPopperContent />}
        >
            {(setReferenceElement: any) => (
                <Link
                    ref={setReferenceElement}
                    tabIndex={-1}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                    to="/products"
                >
                    Products
                </Link>
            )}
        </Popper>
    )
}
