import React from 'react'
import styled from 'styled-components'
import MessageForm from './messageform'
import Mail from  '../images/mail.svg'
import Phone from  '../images/phone.svg'
import Time from  '../images/time.svg'
import Location from  '../images/location.svg'
import Whatsapp from '../images/whatsapp.svg'

const Contact = styled.div`
    display:flex;
    flex:1 0 50%;
    flex-wrap:wrap;

    .icon{
      width:30px;
      margin:0px 0px;
    }

    section{
      display:flex;
      flex: 1 0 400px;
      flex-wrap:wrap;
      margin:10px 20px;
      align-content:flex-start;
      justify-content:center;
    }

    h2{
      font-family: 'Montserrat', sans-serif;
      font-size:36px;
      font-weight:400;
      color:#35486F;
       width:100%;
       text-align:center;
     }

     h3{
      font-family: 'Montserrat', sans-serif;
      font-size:24px;
      font-weight:400;
      color:#35486F;
       width:100%;
       text-align:center;
  
     }
`
export const ContactItem = styled.div`
  display:flex;
  height:50px;
  max-width:500px;
  padding:${props => props.padding || "0px"};
  justify-content:flex-start;
  align-items:center;
  font-family: 'Montserrat', sans-serif;
  font-size:16px;
  font-weight:400;
  color:#35486F;
`

export const ContactLink = styled.a`
  display:flex;
  height:50px;
  width:fit-content;
  max-width:100%;
  padding:${props => props.padding || "0px"};
  justify-content:flex-start;
  align-items:center;
  font-family: 'Montserrat', sans-serif;
  font-size:16px;
  font-weight:400;
  color:#35486F;
  text-decoration:none;
  hyphens:'auto';
  &:hover{
    color:#1e52bc;
  }
`

export default function ContactComp() {
    return (
        <Contact>
            <h2>Get In Touch</h2>
            <section style={{padding:'0 150px',boxSizing:'border-box'}}>
            <ContactUs/>
            </section>
            <section>
            <MessageForm/>
            </section>
        </Contact>
    )
}

export function ContactUs(){

    return(
      <>
        <h3>Contact Us</h3>
        <ContactLink href='mailto:customerservice@savannahglow.com'><Mail fill='#474E52' className='icon' style={{minWidth:30}}/>
        <span lang='en' style={{hyphens:'auto',overflowWrap:'break-word',maxWidth: 'calc(100% - 50px)',}}>customerservice@savannahglow.com</span>
        </ContactLink>
        <ContactLink href='tel:00233242372715'><Phone fill='#474E52' className='icon'/> (+233) 0244569221</ContactLink>
        <ContactLink href='https://wa.me/233242372715'><Whatsapp fill='#474E52' className='icon'/> (+233) 0244569221</ContactLink>
        <ContactItem><Location fill='#474E52' className='icon'/> sp4, Nkrumah Flats</ContactItem>
        <ContactItem><Time fill='#474E52' className='icon'/> 9:00am - 5:00pm</ContactItem>
      </>
    )
  }