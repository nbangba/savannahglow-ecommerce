import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage, validateYupSchema } from 'formik';
import { Input } from './addressform';
import { InputWrapper } from './addressform';
import PhoneInput from 'react-phone-input-2';
import { Label } from './addressform';
import { Button } from './addressform';
import { GSelect } from './addressform';
import { reactTextInput } from './addressform';
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group';
import Reauth from './reauth';
import { ModalComponent } from './addressform';
import firebase from '../firebase/fbconfig';
import ShowPassword from '../images/show-password.svg'
import HidePassword from '../images/hide-password.svg'
import AddressForm from './addressform';
import * as Yup from 'yup'
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
  width: 60px;
  height: 34px;

  input{
    opacity: 0;
    width: 0;
    height: 0;
  }
`

  function Account(){
      return(
        <Formik
        initialValues={{ fisrtname:'',lastname:'',email: '',phone:''}}
        validate={values => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            console.log(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting,setFieldValue,handleChange,values }) => (
          <Form style={{display:'flex',flexWrap:'wrap',width:'100%',overflow:'hidden'}}>
            <InputWrapper>
                <Label for='firstname' >First Name</Label>
                <Input onChange={handleChange} value={values.firstname} type="text" name="firstname"  id='firstname' />
            </InputWrapper>
            <InputWrapper>
                <Label for='lastname' >Last Name</Label>
                <Input onChange={handleChange} value={values.lastname} type="text" name="lastname"  id='lastname' />
            </InputWrapper>
            <InputWrapper>
                <Label for='email' >Email</Label>
                <Input onChange={handleChange} value={values.email} type="email" name="email" id="email" />
                <ErrorMessage name="email" component="div" />
            </InputWrapper>
            <InputWrapper>
            <Label for='phone' >Phone Number</Label>
            <PhoneInput onChange={handleChange} value={values.phone} type="text" name="phone" id="phone" dropdownStyle={{...dropDownStyle}} inputStyle={{...reactTextInput}}/>
            </InputWrapper>
            
            <InputWrapper style={{display:'flex',justifyContent:'flex-end'}} >
            <Button secondary  type='button'
              style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >CANCEL</Button>
              <Button primary type='submit'  disabled={isSubmitting}
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
      <LinkButton onClick={()=>setDeleteAccount(true)}>
      Delete Account
    </LinkButton>
    <ModalComponent width="600px" showModal={changeEmail}>
      <ChangeEmail setShowModal={setChangeEmail}/>
    </ModalComponent>
    <ModalComponent width="600px" showModal={changePassword}>
      <ChangePassword setShowModal={setChangePassword}/>
    </ModalComponent>
    <ModalComponent showModal={deleteAccount}>
      <DeleteAccount setShowModal={setDeleteAccount}/>
    </ModalComponent>
    </div>
    )
}

function ChangeEmail({setShowModal}){
  const user = firebase.auth().currentUser;
  const [reauth,setReauth] = useState(false)
  const[success,setSuccess] =useState(false)
   return(
    <Formik
    initialValues={{ email: '',}}
    validate={values => {
      const errors = {};
      if (!values.email) {
        errors.email = 'Required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = 'Invalid email address';
      }
      return errors;
    }}
    onSubmit={(values, { setSubmitting }) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2));
        user.updateEmail(values.email).then(() => {
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
  >{({ isSubmitting,setFieldValue,handleChange,values }) => (
    success?
    <div>
      You successfully changed your email to {values.email}
    </div>
    :
    <Form style={{display:'flex',flexWrap:'wrap',width:'100%',overflow:'hidden',maxWidth:500}}>
      <InputWrapper wide>
        <Label for='email' >New Email</Label>
        <Input onChange={handleChange} value={values.email} type="email" name="email"/>
      </InputWrapper>
      <InputWrapper style={{display:'flex',justifyContent:'flex-end'}} wide >
            <Button secondary onClick={()=>setShowModal(false)} type='button'
              style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >CANCEL</Button>
              <Button primary type='submit'  disabled={isSubmitting}
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

function ChangePassword({setShowModal}){
  const user = firebase.auth().currentUser;
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
    onSubmit={(values, { setSubmitting }) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2));
        user.updatePassword(values.password).then(() => {
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
    {({ isSubmitting,setFieldValue,handleChange,handleSubmit,values,errors }) => (
    success?
    <div>
      You successfully changed your password
    </div>
    :
    <Form style={{display:'flex',flexWrap:'wrap',width:'100%',overflow:'hidden',maxWidth:'500px'}}>
      <InputWrapper style={{maxWidth:'80%'}}>
        <Label for='password' >New Password</Label>
        <Input onChange={handleChange} value={values.password} type={showPassword?'text':'password'} name="password"/>
        {errors && errors.password}
      </InputWrapper>
     <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
       {showPassword? 
        <HidePassword onClick={()=> setShowPassword(!showPassword)} fill='#474E52'style={{width:60,height:60}}/>:
        <ShowPassword onClick={()=> setShowPassword(!showPassword)} fill='#474E52' style={{width:60,height:60}}/>}
     </div>
      <InputWrapper style={{maxWidth:'80%'}}>
        <Label for='confirmPassword' >Confirm Password</Label>
        <Input onChange={handleChange} value={values.confirmPassword} type="password" name="confirmPassword"/>
        {errors && errors.confirmPassword}
      </InputWrapper>
      <InputWrapper style={{display:'flex',justifyContent:'flex-end',maxWidth:'80%'}} wide >
       <Button secondary onClick={()=>setShowModal(false)} type='button'
        style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >CANCEL</Button>
        <Button primary type='submit'  disabled={isSubmitting}
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

function DeleteAccount({setShowModal}){
  const user = firebase.auth().currentUser;
  const [reauth,setReauth] = useState(false)
  const[success,setSuccess] =useState(false)
  const termsSchema = Yup.object().shape({
    agree: Yup.boolean()
            .oneOf([true], "You must accept the terms and conditions")
  }) 
  return(
    <Formik
    initialValues={{agree:false}}
    validationSchema={termsSchema}
    onSubmit={(values, { setSubmitting }) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2));
        user.delete().then(() => {
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
    {({ isSubmitting,setFieldValue,handleChange,handleSubmit,values,errors }) => (
    success?
    <div>
      You successfully deleted your account
    </div>
    :
    <Form style={{display:'flex',flexWrap:'wrap',width:'100%',overflow:'hidden'}}>
       <div>By agreeing to this action, ypur account and all information associated with it will be deleted</div>
      <InputWrapper>
        <Label for='agree' >I agree</Label>
        <Input onChange={handleChange} value={values.agree} type="checkbox" name="agree"/>
        {errors && errors.agree}
        </InputWrapper>
      <InputWrapper style={{display:'flex',justifyContent:'flex-end'}} >
       <Button secondary onClick={()=>setShowModal(false)} type='button'
        style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >CANCEL</Button>
        <Button primary type='submit'  disabled={isSubmitting}
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
      initialValues={{ fisrtname:'',lastname:'',email: '',phone:''}}
      validate={values => {
        const errors = {};
        if (!values.email) {
          errors.email = 'Required';
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          console.log(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting,setFieldValue,handleChange,values }) => (
        <Form style={{width:'500px'}}>
          <InputWrapper>
              <Label for='firstname' >Subscribe to newsletters</Label>
              <Input onChange={handleChange} value={values.firstname} type="checkbox" name="firstname"  id='firstname' />
          </InputWrapper>
          <InputWrapper>
              <Label for='lastname' >Recieve Notifications</Label>
              <Input onChange={handleChange} value={values.lastname} type="checkbox" name="lastname"  id='lastname' />
          </InputWrapper>
         
          <InputWrapper wide style={{display:'flex',justifyContent:'flex-end'}} >
          <Button secondary  type='button'
            style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >CANCEL</Button>
            <Button primary type='submit'  disabled={isSubmitting}
            style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >SEND</Button>
            </InputWrapper>
            
        </Form>
      )}
    </Formik>
    )
}

function AccordionButton({active,setActive,name,title,children}){
    
    return(
        <AccordionButtonWrapper>
        <Accordion onClick={()=>(active==name)?setActive(null):setActive(name)}>
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

export default function Settings(){
    const [active,setActive] = useState(null)
  return(
      <SettingsWrapper>
     <AccordionButton name='account' title="Account" active={active} setActive={setActive}>
         <Account/>
     </AccordionButton>
     <AccordionButton name='password' title="Password" active={active} setActive={setActive}>
        <Password/>
    </AccordionButton>
     <AccordionButton name='address' title="Address" active={active} setActive={setActive}>
        <AddressForm/>
    </AccordionButton>
    <AccordionButton name='notifications' title="Notifications" active={active} setActive={setActive}>
        <Notifications/>
    </AccordionButton>
    </SettingsWrapper>
  )
}