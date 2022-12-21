import React,{useState} from 'react'
import styled from 'styled-components'
import Instagram from '../images/svgs/icon-instagram.svg'
import {ContactUs} from './contact'
import Logo from '../images/svgs/logo.svg'
import { Helmet } from 'react-helmet'
import { ContactLink } from './contact'
const Foot = styled.footer`
  position:relative;
  display:flex;
  min-width:100%;
  min-height:fit-content;
  flex-wrap:wrap;
  justify-content:center;
  margin-top:100px; 
  background:linear-gradient(rgb(231 195 161 / 70%),rgb(242 214 177 / 30%));

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
       padding:10px 20px;
       max-width:500px;
       flex:1 0 200px;
       box-sizing:border-box;
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

#mc_embed_signup{
  background:rgb(255 255 255 / 0%);

  .foot{
    margin-top:10px;
  }
}

`
export default function Footer() {
  const [subscriberEmail, setSubscriberEmail] = useState('')
  const handleChange =(e)=>{
    setSubscriberEmail(e.target.value)
  }
    return (
      
       <Foot>
         <Helmet>
         <link href="//cdn-images.mailchimp.com/embedcode/slim-10_7_dtp.css" rel="stylesheet" type="text/css"/>
            <style type="text/css">{
             ' #mc_embed_signup{background:#fff; clear:left; font:14px Montserrat,Helvetica,Arial,sans-serif; }'
              /* Add your own Mailchimp form style overrides in your site stylesheet or in this style block.
                We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */
            }
            </style>
         </Helmet>
           <Logo style={{width:100,height:100}}/>
            <section >
               <ContactUs/>
            </section>
            <section>
            <div id="mc_embed_signup">
              <form action="https://gmail.us5.list-manage.com/subscribe/post?u=cf498c936bf992a19fdbe5f5a&amp;id=62defa14cc" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
                  <div id="mc_embed_signup_scroll">
                <label for="mce-EMAIL">Subscribe to our newsletter</label>
                <input type="email" onChange={handleChange} value={subscriberEmail} name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required/>

                  <div style={{position: 'absolute', left: -5000}} aria-hidden="true"><input type="text" name="b_cf498c936bf992a19fdbe5f5a_62defa14cc" tabindex="-1" value=""/></div>
                      <div class="optionalParent">
                          <div class="clear foot">
                              <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"/>
                              
                          </div>
                      </div>
                  </div>
              </form>
            </div>
           </section>
           <ul>
               

               <li>
                 <ContactLink href='https://www.instagram.com/savannah_glow_shea_butter/'>
                 <Instagram className='social' />
                 </ContactLink>
               </li>
               {/*
               <li>
                   <Facebook className='social' />
               </li>
               <li>
                  <Pinterest className='social' />
               </li>
               */}
           </ul>        
       </Foot>
    )
}
