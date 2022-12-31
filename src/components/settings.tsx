
import React, { useState,useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage, validateYupSchema } from 'formik';
import { Input } from './addressform';
import { InputWrapper } from './addressform';
import PhoneInput from 'react-phone-input-2';
import { Label } from './addressform';
import { Button } from './navbar';
import { reactTextInput } from './addressform';
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group';
import Reauth from './reauth';
import  ModalComponent from './modal';
//import firebase from '../firebase/fbconfig';
import ShowPassword from '../images/svgs/show-password.svg'
import HidePassword from '../images/svgs/hide-password.svg'
import AddressForm from './addressform';
import * as Yup from 'yup'
//import { useFirestoreConnect } from 'react-redux-firebase';
//import { useSelector } from 'react-redux';
import Addresscard from './addresscard';
import { doc, getFirestore,collection,query,orderBy,where, deleteDoc, setDoc} from 'firebase/firestore';
import { useUser,useFirestoreCollectionData,useFirestoreDocData, useFirestore, ObservableStatus} from 'reactfire';
import { updateEmail,updatePassword,deleteUser} from 'firebase/auth'; // Firebase v9+
import Errorwrapper from './errorwrapper';
import { AddressCardOptions } from './addresscard';
import Cards from 'react-credit-cards'
import { getAnalytics, logEvent } from "firebase/analytics";
import { Card } from './card';
import { Remove } from './addresscard';
import { AddressInfoProps } from './addressform';
import { AnyMessageParams } from 'yup/lib/types';

const dropDownStyle ={
    border:'1px solid #556585',
    backgroudColor:'#f4ece6',
}

const Accordion = styled.div`
    background-color: #e5cfc1;
    font-family: 'Montserrat', sans-serif;
    color:#35486F;
    font-weight:bold;
    cursor: pointer;
    padding: 18px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    transition: 0.4s;
    box-sizing:border-box;
     &:hover{
        background-color: #dbb7a1;; 
     }
`

const AccordionButtonWrapper = styled.div`
  max-width:900px;
  width:100%;
  font-family: 'Montserrat', sans-serif;
  margin:auto;
 .accordion-enter{
    max-height:0;
    opacity:0;
    
  }

  .accordion-enter-active{
   max-height:500px;
   opacity:1;
   transition: max-height 1000ms, opacity 1000ms;
 }

 .accordion-exit{
     max-height:500px;
 }
 
 .accordion-exit-active{
   max-height:0;
   opacity:0;
   transition: max-height 1000ms, opacity 1000ms;
 }

`

const SettingsWrapper = styled.div`
   width:100%;
   display:flex;
   flex-wrap:wrap;
   justify-content:center;
`
const LinkButton = styled.div`
   width:100%;
   max-width:800px;
   padding:10px;
   margin:10px;
   font-family: 'Montserrat', sans-serif;
   color:#35486F;
   cursor:pointer;
   &:hover{
     color:#1e52bc;
   }
`

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 45px;
  height: 25.5px;

  input{
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + span {
    background-color: #2659bf;
  }

  input:checked + span:before {
    
    transform: translateX(19.5px);
  }
  
`
const Slider =styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #7b7c7c;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 25.5px;

  &:before{
    position: absolute;
  content: "";
  height: 19.5px;
  width: 19.5px;
  left: 3px;
  bottom: 3px;
  border-radius: 50%;
  background-color: #f4ece6;
  -webkit-transition: .4s;
  transition: .4s;
  }
`
const CardWrapper = styled.div`
  display:flex;
  width:100%;
  flex:1 0 200px;
  flex-wrap:wrap;
  overflow-x:auto;
`
  function Account(){
      const { data: user } = useUser()

      return(
        <Formik
        initialValues={{ displayName:user&&user.displayName||'',email:user&&user.email||'',phone:user&&user.phoneNumber||''}}
        //Remember to add yup for  validation check.
        onSubmit={(values:any, { setSubmitting }:any) => {
          setTimeout(() => {
            console.log(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting, setFieldValue, handleChange, values}:any) => (
          <Form style={{display:'flex',flexWrap:'wrap',width:'100%',overflow:'hidden'}}>
            <InputWrapper>
                <Label>Display Name</Label>
                <Input onChange={handleChange} value={values.displayName} type="text" name="displayName"  id='displayName' />
            </InputWrapper>
            <InputWrapper>
                <Label>Email</Label>
                <Input onChange={handleChange} value={values.email} type="email" name="email" id="email" />
                <ErrorMessage name="email" component="div" />
            </InputWrapper>
            <InputWrapper>
                <Label>Phone Number</Label>
                <PhoneInput onChange={handleChange} value={values.phone} dropdownStyle={{...dropDownStyle}} inputStyle={{...reactTextInput}}/>
            </InputWrapper>
            
            <InputWrapper style={{display:'flex',justifyContent:'flex-end'}} >
            <Button secondary  type='button' onClick={()=>{}}
              style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >CANCEL</Button>
              <Button primary type='submit'  disabled={isSubmitting} onClick={()=>{}}
              style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >SEND</Button>
              </InputWrapper>
              
          </Form>
        )}
      </Formik>
      )
  }

  function Password(){
    const [changeEmail,setChangeEmail] = useState(false)
    const [changePassword,setChangePassword] = useState(false)
    const [deleteAccount,setDeleteAccount] = useState(false)
    return(
    <div>
        <LinkButton onClick={()=>setChangeEmail(true)}>
          Change Email
        </LinkButton>
        <LinkButton onClick={()=>setChangePassword(true)}>
          Change Password
        </LinkButton>
        <LinkButton onClick={()=>setDeleteAccount(true)} >
          Delete Account
        </LinkButton>
        <ModalComponent width="600px" showModal={changeEmail} title='Change Email'>
          <ChangeEmail setShowModal={setChangeEmail}/>
        </ModalComponent>
        <ModalComponent width="600px" showModal={changePassword} title='Change Password'>
          <ChangePassword setShowModal={setChangePassword}/>
        </ModalComponent>
        <ModalComponent showModal={deleteAccount} title="Delete Account">
          <DeleteAccount setShowModal={setDeleteAccount} />
        </ModalComponent>
    </div>
    )
}

interface ChangeMailProps{
  setShowModal:(showModal:boolean)=>void
}
function ChangeEmail({setShowModal}:ChangeMailProps){
  //const user = firebase.auth().currentUser;

  const { data: user } = useUser()
  const [reauth,setReauth] = useState(false)
  const[success,setSuccess] =useState(false)
   return(
    <Formik
    initialValues={{ email: '',}}
    //Remember to validate with YUP
    onSubmit={(values:any, { setSubmitting }:any) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2));
        if(user)
        updateEmail(user,values.email).then(() => {
          setSuccess(true)
          console.log(`email updated to ${values.email} successfully`)
        }).catch((error) => {
          // An error occurred
          // ...
          console.log(error)
          setReauth(true)
        });
        setSubmitting(false);
      }, 400);
    }}
  >{({ isSubmitting,handleChange,values }:any)=>(
    success?
    <div>
      You successfully changed your email to {values.email}
    </div>
    :
    <Form style={{display:'flex',flexWrap:'wrap',width:'100%',overflow:'hidden',maxWidth:500,justifyContent:'center'}}>
      <InputWrapper wide>
        <Label >New Email</Label>
        <Input onChange={handleChange} value={values.email} type="email" name="email"/>
      </InputWrapper>
      <InputWrapper style={{display:'flex',justifyContent:'flex-end'}} wide >
            <Button secondary onClick={()=>setShowModal(false)} type='button'
              style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >CANCEL</Button>
              <Button primary type='submit'  disabled={isSubmitting} onClick={()=>{}}
              style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >SEND</Button>
              </InputWrapper>
              {reauth && 
                <InputWrapper>
                 <div>For Security Purpose Sign in and try again</div>
                 <Reauth type='email'  change={values.email}/>
                </InputWrapper> 
            }
      </Form>
      )}
    </Formik>
   )


}

function ChangePassword({setShowModal}:ChangeMailProps){
  //const user = firebase.auth().currentUser;
  const { data: user } = useUser()
  const [reauth,setReauth] = useState(false)
  const[success,setSuccess] =useState(false)
  const [showPassword,setShowPassword]=useState(false)

  const passWordSchema = Yup.object().shape({
    password: Yup.string().required('Password is required')
              .min(6,'Password is too short'),
    confirmPassword: Yup.string()
       .required('Confirmation is required')
       .oneOf([Yup.ref('password'), null], 'Passwords must match')
  });
   return(
    <Formik
    initialValues={{password: '',confirmPassword:''}}
    validationSchema={passWordSchema}
    onSubmit={(values:any, { setSubmitting }:any) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2));
        if(user)
        updatePassword(user,values.password).then(() => {
          setSuccess(true)
          // Update successful.
        }).catch((error) => {
          // An error ocurred
          // ...
          console.log(error)
          setReauth(true)
        });
        
        setSubmitting(false);
      }, 400);
    }}>
    {({ isSubmitting,setFieldValue,handleChange,handleSubmit,values,errors }:any) => (
    success?
    <div>
      You successfully changed your password
    </div>
    :
    <Form style={{display:'flex',flexWrap:'wrap',width:'100%',overflow:'hidden',maxWidth:'500px',justifyContent:'center'}}>
      <InputWrapper style={{maxWidth:'80%'}}>
        <Label >New Password</Label>
        <Input onChange={handleChange} value={values.password} type={showPassword?'text':'password'} name="password"/>
        {errors && errors.password}
      </InputWrapper>
     <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
       {showPassword? 
        <HidePassword onClick={()=> setShowPassword(!showPassword)} fill='#474E52'style={{width:60,height:60}}/>:
        <ShowPassword onClick={()=> setShowPassword(!showPassword)} fill='#474E52' style={{width:60,height:60}}/>}
     </div>
      <InputWrapper style={{maxWidth:'80%'}}>
        <Label  >Confirm Password</Label>
        <Input onChange={handleChange} value={values.confirmPassword} type="password" name="confirmPassword"/>
        {errors && errors.confirmPassword}
      </InputWrapper>
      <InputWrapper style={{display:'flex',justifyContent:'flex-end',maxWidth:'80%'}} wide >
       <Button secondary onClick={()=>setShowModal(false)} type='button'
        style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >CANCEL</Button>
        <Button primary type='submit'  disabled={isSubmitting} onClick={()=>{}}
        style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >SEND</Button>
      </InputWrapper>
              <>{reauth && 
                <InputWrapper>
                 <div>For Security Purpose Sign in and try again</div>
                 <Reauth type='email' />
                </InputWrapper>  }
             </>  
      </Form>
      )}
    </Formik>
   )
}

function DeleteAccount({setShowModal}:ChangeMailProps){
  //const user = firebase.auth().currentUser;
  const { data: user } = useUser()
  const [reauth,setReauth] = useState(false)
  const[success,setSuccess] =useState(false)
  const termsSchema = Yup.object().shape({
    agree: Yup.string()
            .required("You must accept the terms and conditions")
  }) 
  return(
    <Formik
    initialValues={{agree:'agree'}}
    validationSchema={termsSchema}
    onSubmit={(values:any, { setSubmitting }:any) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2));
        if(user)
        deleteUser(user).then(() => {
          setSuccess(true)
          // User deleted.
        }).catch((error) => {
          // An error ocurred
          // ...
          console.log(error)
          setReauth(true)
        });
        
        setSubmitting(false);
      }, 400);
    }}>
    {({ isSubmitting,setFieldValue,handleChange,handleSubmit,values,errors }:any) => (
    success?
    <div>
      You successfully deleted your account
    </div>
    :
    <Form style={{display:'flex',flexWrap:'wrap',width:'100%',overflow:'hidden',justifyContent:'center'}}>
       <div style={{textAlign:'center'}}>By agreeing to this action, your account will be deleted forever</div>
      <InputWrapper style={{display:'flex',justifyContent:'center',width:'100%',flex:'1 0 100%'}}>
       <label className="container">
            <input type="checkbox"  onChange={handleChange} value={values.agree} name="agree"/>
            <span className="checkmark"></span>
        </label>
        <Label >I agree</Label>
        
        </InputWrapper>
        <div style={{display:'flex',justifyContent:'center',width:'100%',flex:'1 0 100%'}}>
        {errors && errors.agree}
        </div>
      <InputWrapper style={{display:'flex',justifyContent:'center'}} >
       <Button secondary onClick={()=>setShowModal(false)} type='button'
        style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >CANCEL</Button>
        <Button primary type='submit'  disabled={isSubmitting} onClick={()=>{}}
        style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >SEND</Button>
      </InputWrapper>
              <>{reauth && 
                <div>
                 <div>For Security Purpose Sign in and try again</div>
                 <Reauth type='email' />
                </div>  }
             </>  
      </Form>
      )}
    </Formik>
  )
}

function Notifications(){
    return(
      <Formik
      initialValues={{ newsletter:'newsletter',notifications:'notifications'}}
      //add functionality
      onSubmit={(values:any, { setSubmitting }:any) => {
        setTimeout(() => {
          console.log(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting,setFieldValue,handleChange,values }:any) => (
        <Form style={{maxWidth:'500px'}}>
          <InputWrapper style={{display:'flex',flexWrap:'wrap',width:'100%',flex:'1 1 100px',justifyContent:'space-between',minWidth:200}}>
              <Label  >Subscribe to newsletters</Label>
              <Switch>
              <Input onChange={handleChange} value={values.newsletter} type="checkbox" name="firstname"  id='firstname' />
              <Slider></Slider>
              </Switch> 
          </InputWrapper>
          <InputWrapper style={{display:'flex',flexWrap:'wrap',width:'100%',flex:'1 1 100px',justifyContent:'space-between',minWidth:200}}>
              <Label >Recieve Notifications</Label>
              <Switch>
              <Input onChange={handleChange} value={values.notifications} type="checkbox" name="firstname"  id='firstname' />
              <Slider></Slider>
              </Switch>
          </InputWrapper>
         
          <InputWrapper wide style={{display:'flex',justifyContent:'flex-end'}} >
          <Button secondary  type='button'onClick={()=>{}}
            style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >CANCEL</Button>
            <Button primary type='submit'  disabled={isSubmitting} onClick={()=>{}}
            style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >SEND</Button>
            </InputWrapper>
            
        </Form>
      )}
    </Formik>
    )
}

interface AccordionButtonProps{
  active:string,
  setActive:(active:string)=>void,
  name:string,
  title:string,
  children:JSX.Element|JSX.Element[]
}
export function AccordionButton({active,setActive,name,title,children}:AccordionButtonProps){
    
    return(
        <AccordionButtonWrapper>
        <Accordion onClick={()=>(active==name)?setActive(""):setActive(name)}>
            {title}
        </Accordion>
        <CSSTransition in={active==name} timeout={1000} unmountOnExit  classNames='accordion'>
          <div style={{maxWidth:800,margin:'auto',overflow:'hidden',}}>
             {children}
          </div>
       </CSSTransition>
     </AccordionButtonWrapper>
    )
}

interface AddressesProps{
  wrap:boolean,
  selectable?:boolean,
  selected?:AddressInfoProps,
  setSelected?:(selected:AddressInfoProps)=>void,
}
export function Addresses({wrap,selectable,selected,setSelected}:AddressesProps){
  const { data: user } = useUser()
  const firestore = useFirestore();
  const addressesCollection = collection(firestore, 'addresses');
  const addressesQuery = query(addressesCollection,orderBy('dateCreated', 'desc'),where('user','==',user?user.uid:''))
  const getDefault = (addresses:AddressInfoProps[])=> addresses.filter((address)=> address.isDefault)
  const { status, data:addresses } = useFirestoreCollectionData(addressesQuery) as ObservableStatus<AddressInfoProps[]>;
  const[defaultAddress,setDefaultAddress] = useState<string|null>(null)
  const [showModal, setShowModal] = useState(false)
  
  useEffect(() => {
    const currentDefault = getDefault(addresses)
    if((currentDefault.length == 1) && currentDefault[0].NO_ID_FIELD)
    setDefaultAddress(currentDefault[0].NO_ID_FIELD)
  }, [addresses])
  
  
  
  return(
    <div>
      <Button type='button' secondary onClick={()=> setShowModal(true)}>Add Address</Button>
      <ModalComponent showModal={showModal} setShowModal={setShowModal}>
                <AddressForm setShowModal={setShowModal}/>
      </ModalComponent>
      <CardWrapper >
          {
            addresses && addresses.map((addressInfo)=> {
              return(
            <Addresscard selectable={selectable} selected={selectable&&((selected&&selected.NO_ID_FIELD) == addressInfo.NO_ID_FIELD)} setSelected={setSelected}  addressInfo={addressInfo} key={addressInfo.NO_ID_FIELD}>
              <AddressCardOptions defaultAddress={defaultAddress} setDefaultAddress={setDefaultAddress} addressInfo={addressInfo}/>
            </Addresscard>
              )
            }
            )
          }
      </CardWrapper>
   </div>
  )
}

function PaymentCards(){
    const db = useFirestore()
    const{data:user} = useUser()
    const cardsCollection = collection(db, 'cards');
    const cardsQuery =  query(cardsCollection,where('owner','==',user?user.uid:''))
    const {status, data:cards } = useFirestoreCollectionData(cardsQuery);
    const useFsRef = doc(db, 'users',user?user.uid:'');
    const {data: userFs } = useFirestoreDocData(useFsRef);
    const [showModal, setShowModal] = useState(false)
    const [saveCard, setSaveCard] = useState(userFs.saveCard)
    console.log(saveCard)
    
    
    useEffect(() => {
     
        if(saveCard != userFs.saveCard)
          setDoc(useFsRef,{saveCard:saveCard},{merge:true})
          .then(()=>console.log('save cards',saveCard))
          .catch((e)=>console.log(e))
     
    }, [saveCard,userFs])
    
    const deleteCard = (card:any)=> deleteDoc(doc(db, "cards", card.NO_ID_FIELD))
                                .then(()=> console.log('Card deleted'))
                                .catch((e)=>console.log(e))
   
    function DeleteCardDialog({card}:any){
      return(
        <ModalComponent showModal={showModal} setShowModal={setShowModal}>
          <div>
          <div>Are you sure you want to delete this card?</div>
          <button onClick={()=>setShowModal(false)}>No</button><button onClick={()=>{deleteCard(card);setShowModal(false)}}>Yes</button>
          </div>
        </ModalComponent>
      )
    }                            
    return(
      <div style={{display:'flex',flexWrap:'wrap'}} >{
      cards && cards.map((card)=>
        <Card>
          <Remove style={{zIndex:100}} onClick={()=>setShowModal(true)}/>
          <DeleteCardDialog card={card}/>
          <Cards  cvc='***'
          expiry={`${card.authorization.exp_month}/${card.authorization.exp_year}`} 
          name={card.authorization.account_name?card.authorization.account_name:'CARD HOLDER'}
          number={`${card.authorization.bin}******${card.authorization.last4}`} />
        </Card>
        ) 
      }
      <InputWrapper style={{display:'flex',flexWrap:'wrap',width:'100%',flex:'1 1 100px',justifyContent:'space-between',maxWidth:200,minWidth:200}}>
              <Label >Save cards</Label>
              <Switch>
              <Input onChange={()=> {setSaveCard((prev:boolean)=>!prev)}} checked={saveCard} type="checkbox" name="firstname"  id='firstname' />
              <Slider></Slider>
              </Switch> 
          </InputWrapper>
      </div>
    )
}
export default function Settings(){
  const [active,setActive] = useState('')
  return(
    <SettingsWrapper>
      <AccordionButton name='account' title="Account" active={active} setActive={setActive}>
          <Account/>
      </AccordionButton>
      <AccordionButton name='password' title="Password" active={active} setActive={setActive}>
          <Password/>
      </AccordionButton>
      <AccordionButton name='address' title="Address" active={active} setActive={setActive}>
        <Errorwrapper>
         <Addresses wrap={true} />
        </Errorwrapper>
      </AccordionButton>
      <AccordionButton name='notifications' title="Notifications" active={active} setActive={setActive}>
          <Notifications/>
      </AccordionButton>
      <AccordionButton name='cards' title="Cards" active={active} setActive={setActive}>
        <Errorwrapper>
          <PaymentCards/>
          </Errorwrapper>
      </AccordionButton>
    </SettingsWrapper>
  )
}