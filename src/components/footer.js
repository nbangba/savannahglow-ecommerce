import React from 'react'
import styled from 'styled-components'
import Instagram from '../images/icon-instagram.svg'
import Facebook from '../images/icon-facebook.svg'
import Pinterest from '../images/icon-pinterest.svg'
import {ContactUs} from './contact'
import Logo from '../images/logo.svg'

const Foot = styled.footer`
  position:relative;
  display:flex;
  min-width:100%;
  min-height:fit-content;
  flex-wrap:wrap;
  justify-content:center;
  margin-top:auto;
  ul{
      min-width:100%;
      display:flex;
      flex:1 0 100px;
      padding: 0px;
      text-align:center;
      justify-content:center;

      li{
         display:flex;
         align-items:center;
      }
      span{
          margin:10px;
      }
  }
  
  h3{
    font-family: 'Montserrat', sans-serif;
    font-size:24px;
    font-weight:400;
    color:#35486F;
     width:100%;
     text-align:left;

   }

   section{
       width:100%;
       margin:10px 20px;
       max-width:500px;
   }
  .icon{
    width:30px;
    margin:0px 20px 0px 0px;
  }

.social{
    margin:20px;
     
    path{
    fill:#35486f;
   }

   &:hover path{
    fill:#13213D;
   }
}

`
export default function Footer() {
    return (
       <Foot>
           <Logo style={{width:200,height:200}}/>
            <section >
               <ContactUs/>
            </section>
           <ul>
               <li>
                   <Facebook className='social' />
               </li>

               <li>
                 <Instagram className='social' />
               </li>
               <li>
                  <Pinterest className='social' />
               </li>
           </ul>
       </Foot>
    )
}
