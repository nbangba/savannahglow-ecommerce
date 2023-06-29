import React, { useState, useEffect, lazy } from 'react'
import styled, { css } from 'styled-components'
import Logo from '../../../images/svgs/logo.svg'
import Popper from '../../supportingui/popper'
import slugify from '@sindresorhus/slugify'
import { graphql, Link, useStaticQuery } from 'gatsby'
import HamburgerIcon from '../../../images/svgs/hamburger-menu.svg'
import { getMessaging, getToken } from 'firebase/messaging'
import Drawer from './drawer'
import { MenuContent } from '../../supportingui/popper'
import { MenuContentList } from '../../supportingui/popper'
import { AccordionButton } from '../../settings/settings'
import LoginStatus from './loggedinui'
import Search from '../../search'
import Close from '../../../images/svgs/close-mini.svg'
import Whatsapp from '../../../images/svgs/whatsapp.svg'
const Navbar = styled.div`
    display: flex;
    width: 100%;
    height: auto;
    padding: 10px;
    box-sizing: border-box;
    z-index: 10;

    @media only screen and (min-width: 899.1px) {
        .desktop-menu {
            display: flex;
        }
        .logoMobile {
            position: relative;
            object-fit: cover;
        }
    }

    @media only screen and (max-width: 899px) {
        .logoMobile {
            position: absolute;
            right: 55%;
            width: 80px;
            top: 5px;
        }
        .desktop-menu {
            display: none;
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
    --gradientPrimary: to bottom, #1e7ae9, #194fb9, hsl(221.54deg 79.57% 27.71%);

    background-image: linear-gradient(
        to bottom,
        #fff,
        #f4ece6,
        hsl(42.65deg 43.44% 88.58%)
    );
    box-shadow: 0 4px 11px -2px rgba(37, 44, 97, 0.15),
        0 1px 3px 0 rgba(93, 100, 148, 0.2);
    position: relative;
    color: #35486f;
    border: none;
    cursor: pointer;
    width: 100px;
    padding: 10px;
    margin: 5px;
    box-sizing: border-box;
    border-radius: 0.5rem;
    //margin: 0 10px;
    font-family: 'Montserrat', sans-serif;
    text-align: center;
    &:hover {
        font-weight: bold;
    }

    ${(props: { primary?: boolean; secondary?: boolean; onClick: () => any }) =>
        props.primary &&
        css`
            background: linear-gradient(var(--gradientPrimary));
            box-shadow: 0 4px 11px -2px rgba(37, 44, 97, 0.15),
                0 1px 3px 0 rgba(93, 100, 148, 0.2);
            background-color: #062461;
            color: white;
            margin: 5px;
            min-width: fit-content;
            transition: --gradientPrimary 0.3s ease-out;
            &:hover {
                font-weight: bold;
            }
        `}

    ${(props) =>
        props.secondary &&
        css`
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

const MenuIcon = styled.div`
    cursor: pointer;
    display: none;
    align-items: center;
    @media only screen and (max-width: 899px) {
        display: flex;
    }
`
const MobileSearchButton = styled.div`
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    @media only screen and (min-width: 899px) {
        display: none;
    }
`
const WhatsappWrapper = styled.a`
    cursor: pointer;
    width: 60px;
    height: 60px;
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 3;
    border-radius: 20px;
    /* background: aquamarine; */
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(
        to bottom,
        #fff,
        #f4ece6,
        hsl(42.65deg 43.44% 88.58%)
    );
    box-shadow: 0 4px 11px -2px rgba(37, 44, 97, 0.15),
        0 1px 3px 0 rgba(93, 100, 148, 0.2);
`
export default function Nav() {
    const [openDrawer, setOpenDrawer] = useState(false)
    const [loginUI, setLoginUI] = useState(<></>)
    const [searchUI, setSearchUI] = useState(<></>)
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
                        subcategories {
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
        setSearchUI(<Search />)
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
                            'BExGZ8b5omjWMJy2TtiZql6XHpC4U7FCtsn-o3cwJiwopLQ7R1oB5VCtqiIf-xfERDnKaJjJgZgcKx48eRto06g',
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
        <>
            <WhatsappWrapper href="https://wa.me/233267720270">
                <Whatsapp style={{ width: 40, height: 40, fill: '#2b7c2f' }} />
            </WhatsappWrapper>
            <Navbar>
                <MenuIcon onClick={() => setOpenDrawer(true)}>
                    <HamburgerIcon
                        style={{ width: 40, height: 40, zIndex: 100 }}
                    />
                </MenuIcon>
                <Drawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}>
                    <Close
                        onClick={() => setOpenDrawer(false)}
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            width: 20,
                            height: 20,
                            cursor: 'pointer',
                        }}
                    />
                    <MenuContent>
                        {menuItems.map((item: string, index: number) => (
                            <MenuContentList key={index}>
                                <Link
                                    onClick={() => setOpenDrawer(false)}
                                    to={
                                        item === 'Home'
                                            ? '/'
                                            : `/${item.toLowerCase()}`
                                    }
                                >
                                    {item}
                                </Link>
                            </MenuContentList>
                        ))}
                        <MenuContentList
                            style={{ maxWidth: 190, boxSizing: 'border-box' }}
                        >
                            <Link
                                onClick={() => setOpenDrawer(false)}
                                to="/products/"
                            >
                                Products
                            </Link>
                            <MenuContent>
                                {subMenuItems.map(
                                    (item: any, index: number) => (
                                        <MenuContentList
                                            style={{
                                                width: '100%',
                                                maxWidth: '100%',
                                                paddingLeft: 20,
                                            }}
                                        >
                                            <AccordionButton
                                                title={
                                                    activeTab === item.name
                                                        ? '-'
                                                        : '+'
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
                                                        onClick={() =>
                                                            setOpenDrawer(false)
                                                        }
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
                                                    {item.subcategories.map(
                                                        (subItem: any) => (
                                                            <MenuContentList
                                                                style={{
                                                                    paddingLeft: 20,
                                                                    fontWeight: 200,
                                                                }}
                                                            >
                                                                <Link
                                                                    onClick={() =>
                                                                        setOpenDrawer(
                                                                            false
                                                                        )
                                                                    }
                                                                    to={`/category/${slugify(
                                                                        item.name
                                                                    )}/${slugify(
                                                                        subItem.name
                                                                    )}`}
                                                                >
                                                                    {
                                                                        subItem.name
                                                                    }
                                                                </Link>
                                                            </MenuContentList>
                                                        )
                                                    )}
                                                </MenuContent>
                                            </AccordionButton>
                                        </MenuContentList>
                                    )
                                )}
                            </MenuContent>
                        </MenuContentList>
                    </MenuContent>
                </Drawer>
                <div className="logoMobile">
                    <Link
                        to="/"
                        style={{
                            position: 'relative',
                            zIndex: 3,
                            display: 'inline-block',
                            width: 'fit-content',
                        }}
                    >
                        <Logo style={{ width: 50, height: 80 }} />
                    </Link>
                </div>
                <Menu className="desktop-menu" style={{ flexGrow: 10 }}>
                    {menuItems.map((item: string, index: number) => (
                        <MenuItem key={index}>
                            <Link
                                to={
                                    item === 'Home'
                                        ? '/'
                                        : `/${item.toLowerCase()}`
                                }
                            >
                                {item}
                            </Link>
                        </MenuItem>
                    ))}
                    <MenuItem>{productsLink}</MenuItem>
                </Menu>
                <Menu
                    className="desktop-menu"
                    style={{ width: 350, minWidth: 'fit-content' }}
                >
                    <MenuItem style={{ width: '100%' }}>{searchUI}</MenuItem>
                </Menu>
                {loginUI}
            </Navbar>
            <MobileSearchButton>
                <Menu
                    style={{
                        maxWidth: 500,
                        minWidth: 'fit-content',
                        margin: 'auto',
                    }}
                >
                    <MenuItem
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            padding: 0,
                        }}
                    >
                        {searchUI}
                    </MenuItem>
                </Menu>
            </MobileSearchButton>
        </>
    )
}

function ProductCategories() {
    const { allStrapiCategory } = useStaticQuery(
        graphql`
            query {
                allStrapiCategory {
                    nodes {
                        name
                        subcategories {
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
                            {item.subcategories.map(
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
