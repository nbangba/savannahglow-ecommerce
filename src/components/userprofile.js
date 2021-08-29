import React from 'react'
import styled from 'styled-components'
import { Provider,useSelector } from 'react-redux'

const ProfileWrapper = styled.div`
   display:flex;
   justify-content:center;
   font-family: 'Montserrat', sans-serif;
   color:#35486F;
   width:100%;
   h1{
    width:400px;
    text-align:center;
  }
`
const Info= styled.div`
   width:100%;
   display:flex;
   flex-wrap:wrap;
   justify-content:center;
`
const Profile= styled.div`
 padding:20px;
 border:10px solid #f5d2a687;
 display:flex;
 flex-wrap:wrap;
 max-width:800px;
 justify-content:center;
 background:#f8e4d6;
`
const InfoWrapper= styled.div`
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  margin-top:20px;
   width:100%;
  justify-content:center;
  .item{
      width:200px;
      text-align:left;
      font-weight:bold;
      span{
          width:80px;
          text-align:right;
      }
  }
`

export default function UserProfile() {
    
    return (
        <ProfileWrapper>
            <Profile>
            <h1>Customer Profile</h1>
            <Info>
                <InfoWrapper>
                    <div style={{color:'#474E52',fontWeight:'normal'}} className='item'>First Name</div>
                    <div className='item'>Lukman</div>
                </InfoWrapper>
                <InfoWrapper>
                    <div style={{color:'#474E52',fontWeight:'normal'}} className='item'>Last Name</div>
                    <div className='item'>Ahmed</div>
                </InfoWrapper>
                <InfoWrapper>
                    <div style={{color:'#474E52',fontWeight:'normal'}} className='item'>Email</div>
                    <div className='item'>nbangba.la@gmail.com</div>
                </InfoWrapper>
            </Info>
            </Profile>
        </ProfileWrapper>
    )
}
