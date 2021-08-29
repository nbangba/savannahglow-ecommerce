import React from 'react'
import styled from 'styled-components'
import pomade from '../images/pomade.png'
import woman from '../images/woman.png'
import {Button} from './navbar'
import customer1 from '../images/customer1.jpg'
import Vitamins from  '../images/vitamins.svg'
import Sun from  '../images/sun.svg'
import EcoFriendly from  '../images/eco-friendly.svg'
import HealthyLifestyle from  '../images/healthy-lifestyle.svg'
import Buy from './buy'

const Top= styled.div`
  display:flex;
  width:100%;
  flex:1 0 400px;

  section{
      width:100%;
    min-width:500px;
    position:relative;
    box-sizing:border-box;
  }
  img{
      max-height:100%;
      max-width:100%;
      
      z-index:1;
  }
   .shift{
    transform:translate(0px,-75px);
   }

  h1{
      font-size:72px;
      font-family: 'Montserrat', sans-serif;
      color:#20304F;
      text-align:center;
  }

  h3{
    font-family: 'Niconne', cursive;
    font-size:48px;
    text-align:center;
    color:#35486F;
  }
`

const Benefits = styled.div`
    display:flex;
    width:100%;
    flex:1 0 400px;
    flex-wrap:wrap;
    padding:100px;
    justify-content:space-between;
    box-sizing:border-box;
    h2{
      min-width:100%;
      font-family: 'Montserrat', sans-serif;
      font-size:36px;
      font-weight:400;
      color:#35486F;
    }

    h3{
      min-width:100%;
      font-family: 'Montserrat', sans-serif;
      font-size:24px;
      font-weight:500;
      
      color:#474E52;
    }
    section{
      width:400px;
      border:15px solid ;
      border-image-slice: 1;
      border-width: 5px;
      border-image-source: linear-gradient(250deg,rgba(252,201,132,0.64) ,rgba(235,221,210,0) );
      padding: 20px;
      margin: 20px 0px;
      box-sizing:border-box;
    }

    p{
      min-width:100%;
      font-family: 'Montserrat', sans-serif;
      font-size:18px;
      color:#00000;
    }

    img{
      height:60px;
      width:60px;
      object-fit:cover;
      box-sizing:border-box;
     
    }
 

    .benefits{
      fill: #94d31b; 
    }
`

const Testimonial= styled.div`
   display:flex;
   width:100%;
   box-sizing:border-box;
   flex:1 0;
   flex-wrap:wrap;
   justify-content:center;
   background: linear-gradient(rgba(224,193,175,1) ,rgba(224,193,175,0.2));
   padding:50px;
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

   section{
     display:flex;
     width:50%;
     padding:20px;
     box-sizing:border-box;
     justify-content:center;
     align-items:center;
   }

   img{
     height:60px;
     width:60px;
     object-fit:cover;
     border:5px solid  rgba(252,201,132,0.64);
     box-sizing:border-box;
     border-radius:30px;
   }

   blockquote{
    font-family: 'Montserrat', sans-serif;
    font-style: italic;
    color:#474E52;
   }

   .customer-profile{
     position: relative;
     display:inline-block;
     font-style:normal;
     width:100%;
     text-align:right;
   }
   .quote{

   }
`

export default function Home() {
    return (
        <div>
            <Top>
                <section>
                  <h1>
                      SAVANNAH GLOW
                  </h1>
                  <h3>
                      Enrich your skin
                  </h3>
                  <Button primary style={{width:280,display:'flex',margin:'100px', height:50, fontSize:24,height:60,alignItems:'center',justifyContent:'center'}} >BUY NOW FOR $2.00</Button>
                </section>
                <section>
                  <img className='shift'  src={pomade}></img>  
                </section>
            </Top>
            <Top style={{transform:'translate(-50px,0px)',borderRadius:50,background:'linear-gradient(250deg,rgba(252,201,132,0.64) ,rgba(235,221,210,0) 50%)'}}>
              <section >
              <img   src={woman} style={{objectFit:'cover',objectPosition:'right top'}}></img>
                </section>
                <section>
                  <h1>
                      Be confident in your skin
                  </h1>
                  <h3 style={{fontFamily:`'Montserrat', sans-serif`,fontSize:36,fontWeight:400,margin:'0px 50px'}}>
                      Savannah Glow is enriched in vitamin A & E
                  </h3>
                </section>
                
            </Top>
            <Benefits>
              <h2>
                Why use savannah glow shea butter?
              </h2>
              <section>
                <h3>Rich in vitamins A & E <Vitamins fill='#474E52' style={{width:60}}/></h3>
                
                <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae 
                dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
                sed 
                </p>
              </section>
              <section>
                <h3>Rich in Antioxidants <HealthyLifestyle fill='#474E52' style={{width:80,height:60}}/></h3>
                <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae 
                </p>
              </section>
              <section>
                <h3>Eco-friendly <EcoFriendly fill='#474E52' style={{width:60,}}/></h3>
                <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae 
                
                </p>
              </section>
              <section>
                <h3>UV protection <Sun fill='#474E52' style={{width:60}}/></h3>
                <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae 
                dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
                </p>
              </section>
            </Benefits>
            <Testimonial>
              <h2>
                You're in good company
              </h2>
              <h3>Listen to what some of our customers have to say</h3>
              <section>
                <img src={customer1}/>
                <blockquote>
                  " Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque "
                  <span className='customer-profile'>
                  ~Lukman Ahmed
                  </span>
                </blockquote>
              </section>
              <section>
                <img src={customer1}/>
                <blockquote>
                  " Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque "
                  <span className='customer-profile'>
                  ~Lukman Ahmed
                  </span>
                </blockquote>
              </section>
              <section>
                <img src={customer1}/>
                <blockquote>
                  " Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque "
                  <span className='customer-profile'>
                  ~Lukman Ahmed
                  </span>
                </blockquote>
              </section>
              <section>
               <img src={customer1}/>
                <div>
                <blockquote>
                  " Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque "
                  <span className='customer-profile'>
                  ~Lukman Ahmed
                  </span>
                </blockquote>
                
                </div>
              </section>
            </Testimonial>
        </div>
    )
}

