import React from 'react'
import { CSSTransition } from 'react-transition-group';
import styled,{css} from 'styled-components'

const Modal = styled.div`
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background-color:rgba(0,0,0,0.5);
  display:flex;
  align-items:center;
  justify-content:center;
  
  z-index:100 !important;
  `

  const ModalContent = styled.div`
    position:fixed;
    top:0;
    left:0;
    min-width:200px;
    max-width:200px;
    width:200px;
    height:100%;
    background-color:#EBDDD2;
    border-radius:5px;
    z-index:200 !important;
    font-family: 'Montserrat', sans-serif;

    h3{
        font-family: 'Montserrat',sans-serif;
        font-size:24px;
        font-weight:400;
        color:#35486F;
        width:100%;
        text-align:center;
    }
  `

  const DrawerWrapper = styled.div`
  .drawer-enter{
    min-width:0px;
    max-width:0px;
    width:0;
  }

  .drawer-enter-active{
   max-width:200px;
   min-width:200px;
   width:200px;
   transition: min-width 400ms,max-width 400ms, width 400ms;
 }

 .drawer-exit{
    max-width:200px;
     min-width:200px;
     width:200px;
 }
 
 .drawer-exit-active{
    max-width:0px;
   min-width:0;
   width:0;
   transition: min-width 400ms,max-width 400ms, width 400ms;
 }

 .background-enter{ 
    background-color:rgba(0,0,0,0);
 }

 .background-enter-active{
    background-color:rgba(0,0,0,0.5);
    transition: background-color 400ms;
 }

 .background-exit{
    background-color:rgba(0,0,0,0.5);
 }

 .background-exit-active{
    background-color:rgba(0,0,0,0);
    transition: background-color 400ms;
 }
 `
 //add on exit function for smooth transition before navigation
export default function Drawer({openDrawer,setOpenDrawer,children}) {
    
    return (
        <DrawerWrapper>
        <CSSTransition in={openDrawer} timeout={400} unmountOnExit  classNames='background'>
          <Modal className='background' onClick={()=>setOpenDrawer(false)}/>
       </CSSTransition>
       
       <CSSTransition in={openDrawer} timeout={400} unmountOnExit  classNames='drawer'>
              <ModalContent >
               {children}
             </ModalContent>     
       </CSSTransition>
      </DrawerWrapper>
    )
}
