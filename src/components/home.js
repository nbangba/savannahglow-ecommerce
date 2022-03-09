import React from 'react'
import styled from 'styled-components'
import pomade from '../images/pomade.png'
import woman from '../images/woman.png'
import {Button} from './navbar'
import Vitamins from  '../images/vitamins.svg'
import Sun from  '../images/sun.svg'
import EcoFriendly from  '../images/eco-friendly.svg'
import HealthyLifestyle from  '../images/healthy-lifestyle.svg'
import Buy from './buy'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'gatsby'
const HomeWrapper = styled.div`
.gradient{
  background:linear-gradient(250deg,rgba(252,201,132,0.64) ,rgba(235,221,210,0) 50%);
  transform:translate(-50px,0px)
  }
    
@media only screen and (max-width: 833px) {
  .gradient{
  background:linear-gradient(180deg,rgba(252,201,132,0.64) ,rgba(235,221,210,0) 50%);
  transform:translate(0px,0px)
  }
}
`
const Top= styled.div`
  display:flex;
  width:100%;
  flex:1 0 420px;
  font-family: 'Montserrat', sans-serif;
  flex-wrap: wrap;
  

  section{
    width:50%;
    min-width:400px;
    position:relative;
    box-sizing:border-box;
    h1{
      font-size:3.75rem;
    }
    @media only screen and (max-width: 853px) {
      h1{
        margin:2rem 0rem;
        font-size: 3rem;
      }
      h3{
        font-size:24px;
      }
    }
   }

  img{
      max-height:100%;
      max-width:100%;
      
      z-index:1;
  }
  

  h1{
      font-size:4.5rem;
      font-family: 'Montserrat', sans-serif;
      color:#20304F;
      text-align:center;
      margin:3rem 0rem;
  }

  h3{
    font-family: 'Montserrat', sans-serif;
    font-size:36px;
    text-align:center;
    color:#35486F;
    width:100%;
    margin: 0px;
  }

  li{
    margin: 15px 0px;
  }

  .glow {
    text-align: center;
    animation: glow 1s ease-in-out infinite alternate;
  }
  
  @keyframes glow {
    to {
      text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff8e1, 0 0 40px #fff3e0, 0 0 50px #f4e2b7, 0 0 60px #ff9218, 0 0 10px #fffde7;
    }
    
    from {
      text-shadow: 0 0 2px #ebddd2, 0 0 30px #ebddd2, 0 0 40px #ebddd2, 0 0 50px #ebddd2, 0 0 60px #ebddd2, 0 0 70px #ebddd2, 0 0 80px #ebddd2;
    }
  }

  .sub{
    font-size:36px;
    font-weight:400;
    font-family: 'Montserrat', sans-serif;
   
    @media only screen and (max-width: 1200px) {
      font-size: 24px;
     }
  }
  .gradient{
    margin-top:50px;
    background:linear-gradient(180deg,rgba(252,201,132,0.64) ,rgba(235,221,210,0) 50%);
    }

  @media only screen and (max-width: 833px) {
    

   
    .gradient{
    background:linear-gradient(180deg,rgba(252,201,132,0.64) ,rgba(235,221,210,0) 50%);
    }

    .first{
      order:1;
      min-width: 100%;
    }
    .second{
      order:2;
      min-width: 100%;
    }
   }
  
`

const Benefits = styled.div`
    display:flex;
    width:100%;
    flex:1 0 400px;
    flex-wrap:wrap;
    padding:3vw;
    justify-content:space-around;
    box-sizing:border-box;

    @media only screen and (max-width: 700px) {
      padding: 4rem;
    }

    @media only screen and (max-width: 700px) {
      padding: 2rem;
    }

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
      padding: 1.25rem;
      margin: 1.25rem 0px;
      box-sizing:border-box;
    }

    p{
      min-width:100%;
      font-family: 'Montserrat', sans-serif;
      font-size:1.125rem;
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
   padding:1vw;
   h2{
    font-family: 'Montserrat', sans-serif;
    font-size:2rem;
    font-weight:400;
    color:#35486F;
     width:100%;
     text-align:center;
   }

   h3{
    font-family: 'Montserrat', sans-serif;
    font-size:1.5rem;
    font-weight:400;
    color:#35486F;
     width:100%;
     text-align:center;

   }

   section{
     display:flex;
     width:50%;
     padding:1.25rem;
     box-sizing:border-box;
     justify-content:center;
     align-items:center;
     flex: 1 0 350px;
     
     @media only screen and (max-width: 833px) {
     font-size:
    }
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
        <HomeWrapper>
            <Top>
                <section className='first' style={{display:'flex',flexWrap:'wrap',justifyContent:'center', alignItems:'center'}}>
                  <h1 className='glow'>
                      SAVANNAH GLOW
                  </h1>
                  
                  <ul style={{width:'100%',listStyleType:'none'}}>
                    <li><h3>Enriches your skin</h3></li>
                    <li><h3>Moisturizes and protects skin</h3></li>
                    <li><h3>Prevents hairloss</h3></li>
                  </ul>
                  <Link style={{textDecoration:'none'}} to="/products/savannah-glow-shea-butter"><Button primary style={{width:280,display:'flex',marginBottom:'5vw',  fontSize:24,alignItems:'center',justifyContent:'center'}} >BUY NOW </Button></Link>
                </section>
                <section className='second'>
                  <img   src={pomade}></img>  
                </section>
            </Top>
            <Top className='gradient' style={{borderRadius:50}}>
              <section className='second' >
              <img   src={woman} style={{objectFit:'cover',objectPosition:'right top'}}></img>
                </section>
                <section  className='first' >
                  <h1>
                      Be confident in your skin
                  </h1>
                  <h3 className='sub'>
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
              <Carousel>
              <div>
                
                <blockquote>
                  " Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque "
                  <span className='customer-profile'>
                  ~Lukman Ahmed
                  </span>
                </blockquote>
              </div>
              <div>
                
                <blockquote>
                  " Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque "
                  <span className='customer-profile'>
                  ~Lukman Ahmed
                  </span>
                </blockquote>
              </div>
              <div>
                
                <blockquote>
                  " Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque "
                  <span className='customer-profile'>
                  ~Lukman Ahmed
                  </span>
                </blockquote>
              </div>
              <div>
                <blockquote>
                  " Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque "
                  <span className='customer-profile'>
                  ~Lukman Ahmed
                  </span>
                </blockquote>
              </div>
              </Carousel>
            </Testimonial>
        </HomeWrapper>
    )
}

