import React,{useEffect} from 'react'
import styled,{css} from 'styled-components'
import 'react-phone-input-2/lib/style.css'



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
    width:${props=>props.width||'800px'};
    overflow-y:scroll;
    height:90vh;
    background-color:#EBDDD2;
    border-radius:5px;
    z-index:200 !important;
    h3{
        font-family: 'Montserrat', sans-serif;
        font-size:24px;
        font-weight:400;
        color:#35486F;
         width:100%;
         text-align:center;
    }
    ::-webkit-scrollbar {
        width: 10px;
      }
      
      /* Track */
      ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey; 
        
        border-radius: 5px;
      }
       
      /* Handle */
      ::-webkit-scrollbar-thumb {
        background:#d6b9a2; 
        border-radius: 5px;
      }
      
      /* Handle on hover */
      ::-webkit-scrollbar-thumb:hover {
        background: #c3a893; 
      }
  `
  const FormWrapper = styled.div`
     width:100%;
     display:flex;
     flex-wrap:wrap;
     align-items:center;
     justify-content:center;
     h3{
         width:100%;
     }

  `
 export default function ModalComponent({showModal,children,width}){
  
  useEffect(() => {
    if(showModal)
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    }
  },[showModal])

    if(!showModal)
      return null
      
    
      
    return(
        <Modal>
            <ModalContent width={width}>
                <h3>Enter Your Address</h3>
                <FormWrapper>
                {children}
                </FormWrapper>
            </ModalContent>
        </Modal>
    )
  }