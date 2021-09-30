import React, { useState,useEffect } from 'react'
import styled,{css} from 'styled-components'
import Logo from '../images/logo.svg'
import User from '../images/user.svg'
import SignIn from './signin'
import Popper from './popper'
import ModalComponent from './modal'
import { useUser,useSigninCheck,useFirestore,useFirestoreDocData } from 'reactfire'
import {doc} from '@firebase/firestore'
import Errorwrapper from './errorwrapper';
import { Link } from 'gatsby'
import ShoppingBag from '../images/bag.svg'

const Navbar = styled.div`
   display: flex;
   width:100%;
   height:auto;
   padding:10px;
   box-sizing:border-box;
   z-index:10;

   .tooltip-enter{
     opacity:0;
   }

   .tooltip-enter-active{
    opacity:1;
    transition: opacity 200ms;
  }

  .tooltip-exit{
      opacity:1;
  }
  
  .tooltip-exit-active{
    opacity:0;
    transition: opacity 200ms;
  }
`
const Menu = styled.ul` 
  position: relative; 
  display:flex;
  flex-grow:1;
  justify-content:center;
  align-items:center;
  padding:0px;
  font-family: 'Ubuntu', sans-serif;

  ${props => props.left && css`
  justify-content:flex-end;
  `}
`

const MenuItem = styled.li`
   position: relative;
   display:block;
   color:#35486F;
   text-align:center;
   min-width:100px;
   font-family: 'Montserrat', sans-serif;
   font-size: 1.2rem;
   font-weight: 500;
   box-sizing:border-box;
       a{
        color:#35486F;
        box-sizing: border-box;
        width:100%;
        display:inline-block;
           text-decoration:none;
           &:hover{
            text-decoration: underline; 
           }
       }
`
export const Button = styled.div`
   position:relative;
   color: #35486F;;
   display:block;
   cursor:pointer;
   width:100px;
   padding:10px;
   margin:5px;
   box-sizing:border-box;
   border-radius:0.5rem;
   margin: 0 10px;
   font-family: 'Montserrat', sans-serif;
   text-align:center;
   &:hover{
    color: white;
    background:#13213D;
    transition: background 0.3s ease-out;
    mix-blend-mode: normal;
}

 
   ${props => props.primary && css`
   background-color:#35486F;
   color: white;
   margin:5px;
   min-width:fit-content;
   &:hover{
       color: white;
       background:#13213D;
       transition: background 0.3s ease-out;
       mix-blend-mode: normal;
   }
  `}

  ${props => props.secondary && css`
     background:rgba(224,193,175,0.5);
     text-align:center;
     display:inline-flex;
     border-radius:5px;
     width:50px;
     margin:5px;
     align-items: center;
     justify-content: center;
     min-width:fit-content;
     &:hover{
         color:#35486F;
        background-color:rgba(224,193,175,0.8);
        font-weight:bold;
        transition: background 0.3s ease-out;
    
    }
  `}
`

const UserWrapper = styled.div`
   width:50px;
   height:50px;
   border-radius:50%;
   background:rgba(224,193,175,0.5);
   display:flex;
   justify-content:center;
   align-items:center;
   cursor:pointer;
   transition: background 0.3s ease-out;

   &:hover{
   background:rgba(224,193,175,0.9);
   }
`
const CartNumber = styled.div`
   position:absolute;
   display:flex;
   width:30px;
   height:30px;
   top:1%;
   cursor:pointer;
   left:35.5%;
   color:#3f3633;
   justify-content:center;
   align-items:flex-end;
   font-weight:bold;
`
export default function Nav() {
    const menuItems = ['Home','Catlogue','Blog','Support']
    

    
    return (
        <Navbar>
            <Logo  style={{width:100,height:100}}/>
            <Menu style={{flexGrow:10}}>
                {menuItems.map(item=> <MenuItem><Link to={item==='Home'?'/':`/${item.toLowerCase()}`} >{item}</Link> </MenuItem>)}
            </Menu>
            <Errorwrapper>
                <LoginStatus/>
            </Errorwrapper>
        </Navbar>
    )
}

function LoginStatus(){

    const [showModal, setshowModal] = useState(false)
    const [loggedIn, setloggedIn] = useState(null)
    const [showPopper, setshowPopper] = useState(false)
    const subMenuItems =['Profile','History','Settings']

    const { data: user } = useUser()
    const { status, data: signInCheckResult } = useSigninCheck();
    console.log(user)
    console.log(signInCheckResult)
    const firestore = useFirestore()
    const cartRef =user && doc(firestore, 'carts', user.uid);
    

    const CartComponent = ()=>{
        const { data:cart } = useFirestoreDocData(cartRef);
        console.log('cart',cart)
        return(
            <CartNumber>
                <Link to='/cart'>
                <small>{cart && cart.numberOfItems?cart.numberOfItems:'0'}</small>
                </Link>
        </CartNumber>
        )
    }
    return(
        <Menu left>
            <MenuItem>
            {
                user? <CartComponent/>:<CartNumber><small>0</small></CartNumber>
            }
            <ShoppingBag fill='#474E52' style={{width:30,height:30}}/>
            </MenuItem>
                { status === 'success' &&
                <>
                {
                   signInCheckResult && signInCheckResult.signedIn === true?
                    <Popper subMenuItems={subMenuItems}>
                        {
                            (setReferenceElement,setOpen,open)=>
                            <MenuItem ref={setReferenceElement} tabIndex={-1} onClick={()=>setOpen(!open)}>
                            <UserWrapper><User fill='#474E52' style={{width:30,height:30}}/></UserWrapper>
                            </MenuItem>
                        }
                        
                    </Popper> 
                    :
                    <MenuItem><Button primary onClick={()=>setshowModal(true)}>Sign In/Up</Button></MenuItem>
                }
                </>
                }  
                
                <ModalComponent showModal={showModal}>
                   <SignIn/>
                </ModalComponent>
            </Menu>
    )
}