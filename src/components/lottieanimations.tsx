import React from 'react'
import Lottie from 'react-lottie'
import * as animationData from '../images/animated/happy-delivery-sg.json'
export default function HappDelivery() {
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };
  return (
    <Lottie options={defaultOptions}
              height={400}
              width={400}
              
              />
  )
}
