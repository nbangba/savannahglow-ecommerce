import React from 'react'
import styled from 'styled-components'
import MessageForm from './messageform'
import Mail from  '../images/mail.svg'
import Phone from  '../images/phone.svg'
import Time from  '../images/time.svg'
import Location from  '../images/location.svg'


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
  width:400px;
  max-width:500px;
  padding:${props => props.padding || "0px"};
  justify-content:flex-start;
  align-items:center;
  font-family: 'Montserrat', sans-serif;
  font-size:16px;
  font-weight:400;
  color:#35486F;
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
        <ContactItem><Mail fill='#474E52' className='icon' /> geniusmain@yahoo.com</ContactItem>
        <ContactItem><Phone fill='#474E52' className='icon'/> (+233) 0244569221</ContactItem>
        <ContactItem><Location fill='#474E52' className='icon'/> sp4, Nkrumah Flats</ContactItem>
        <ContactItem><Time fill='#474E52' className='icon'/> 9:00am - 5:00pm</ContactItem>
      </>
    )
  }