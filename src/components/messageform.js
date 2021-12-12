import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styled,{css} from 'styled-components'

const textInput = `width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #35486F;;
  border-radius: 4px;
  box-sizing: border-box;
  background:#f4ece6;
  font-family: 'Montserrat', sans-serif;
  font-size:16px;
  font-weight:400;
  color:#474E52;

  &:focus{
    outline:none;
    border: 2px solid #35486F;
    box-shadow: 0 0 10px #9bb2e1;
  }
  `

const Input = styled.input`
    ${textInput}
`
export const TextAreaInput = styled.textarea`
   ${textInput}
`
const Label = styled.label`
font-family: 'Montserrat', sans-serif;
font-size:16px;
font-weight:400;
color:#35486F;
`
const InputWrapper = styled.div`
  width:100%;
  padding:5px;
  max-width:500px;
`

export const Button = styled.button`
   position:relative;
   color: #35486F;;
   display:block;
   cursor:pointer;
   width:100px;
   padding:10px;
   box-sizing:border-box;
   border-radius:0.5rem;
   margin: 0 10px;
   font-family: 'Ubuntu', sans-serif;
   text-align:center;
   z-index:12;
   &:hover{
    color: white;
    background:#13213D;
    transition: background 0.3s ease-out;
    mix-blend-mode: normal;
}

 
   ${props => props.primary && css`
   background-color:#35486F;
   color: white;
   
   &:hover{
       color: white;
       background:#13213D;
       transition: background 0.3s ease-out;
       mix-blend-mode: normal;
   }
  `}
  ${props => props.secondary && css`
     border:white solid 2px;
     text-align:center;
     &:hover{
        background-color:white;
        color: hsl(353, 100%, 62%);
        font-weight:bold;
        transition: background 0.3s ease-out;
    
    }
  `}
`

 export default function MessageForm() {
     return(
    <>
        <h3>Leave Us A Message</h3>
      <Formik
        initialValues={{ email: '', password: '' }}
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
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form style={{width:'500px'}}>
            <InputWrapper>
                <Label for='name' >Name</Label>
                <Field type="text" name="name"  id='name' component={Input} />
            </InputWrapper>
            <InputWrapper>
                <Label for='email' >Email</Label>
                <Field type="email" name="email" id="email" component={Input} />
                <ErrorMessage name="email" component="div" />
            </InputWrapper>
            <InputWrapper>
                <Label for='message' >Message</Label>
                <Field as='textarea' rows='5' type="text" name="message" id="message" component={TextAreaInput} />
            </InputWrapper>
            <InputWrapper style={{display:'flex',justifyContent:'flex-end'}} >
              <Button primary type='submit'  disabled={isSubmitting}
              style={{width:100,display:'flex',margin:'10px', height:40,
              fontSize:16,alignItems:'center',justifyContent:'center'}} >SEND</Button>
            </InputWrapper>
          </Form>
        )}
      </Formik>
    </>
  )}
  