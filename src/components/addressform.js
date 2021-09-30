import React,{useEffect} from 'react'
import { Formik, Form, Field, ErrorMessage, validateYupSchema } from 'formik';
import styled,{css} from 'styled-components'
import countryCodes from '../data/countrycodes.json'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Autocomplete from "react-google-autocomplete";
import { useSigninCheck,useUser,useFirestore} from 'reactfire';
import { collection, addDoc, serverTimestamp,doc, setDoc } from "firebase/firestore";


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

  export const reactTextInput = {width: '100%',
    padding: '12px 20px',
    paddingLeft:'48px',
    margin: '8px 0',
    display: 'inline-block',
    border: '1px solid #35486F',
    borderRadius: '4px',
    boxSizing: 'border-box',
    background:'#f4ece6',
    fontFamily: `'Montserrat', sans-serif`,
    fontSize:'16px',
    fontWeight:'400',
    color:'#474E52',
    height:'fit-content',

   "&:focus":{
      outline:'none',
      border:'2px solid #35486F',
      boxShadow:'0 0 10px #9bb2e1',
    }
}

 export const dropDownStyle ={
    border:'1px solid #556585',
    backgroudColor:'#f4ece6',
}

export const Input = styled.input`
    ${textInput}
`
export const TextAreaInput = styled.textarea`
   ${textInput}
`
export const Select = styled(PhoneInput)`
${textInput}
`
export const GSelect = styled(Autocomplete)`
${textInput}
`
export const Label = styled.label`
font-family: 'Montserrat', sans-serif;
font-size:16px;
font-weight:400;
color:#35486F;
`
export const InputWrapper = styled.div`
  width:50%;
  padding:15px;
  flex: 1 0 50%;
  min-width:200px;
  box-sizing:border-box;
  ${props => props.wide && css`
  flex: 1 0 100%;
  `}
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
   text-align:center;
   font-family: 'Montserrat', sans-serif;
   font-size:16px;
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
       font-weight:bold;
       mix-blend-mode: normal;
   }
  `}
  ${props => props.secondary && css`
     border:white solid 0px;
     text-align:center;
     background-color:rgba(224,193,175,0.5);
     &:hover{
        background-color:rgba(224,193,175,0.9);
        color: #35486F;
        font-weight:bold;
        transition: background 0.3s ease-out;
    
    }
  `}
`

 export default function AddressForm({setShowModal,
                                      setOrderAddress,
                                      addressInfo={firstname:'',
                                      lastname:'',
                                      email:'',
                                      phone:'',
                                      location:'',
                                      street:'',
                                      city:'',
                                      state:'',
                                      country:''}}) {
   
    const db = useFirestore()
    const { status, data: signInCheckResult } = useSigninCheck();
    const {status:info, data: user } = useUser()
    const addressId = addressInfo.NO_ID_FIELD
    const setAddress =(place,setFieldValue,values)=>{
      let address1=''
      let postcode=''
      for (const component of place.address_components) {
        const componentType = component.types[0];
        
        switch (componentType) {
          case "street_number": {
            address1 = `${component.long_name} ${address1}`;
            break;
          }
    
          case "route": {
            address1 += ` ${component.short_name}`;
            break;
          }
    
          case "postal_code": {
            postcode = `${component.long_name}${postcode}`;
            break;
          }
    
          case "postal_code_suffix": {
            postcode = `${postcode}-${component.long_name}`;
            break;
          }
          case "locality":
            setFieldValue("city", ''+component.long_name)
            break;
    
          case "administrative_area_level_1": {
            setFieldValue("state", ''+component.short_name)
            break;
          }
          case "country":
            setFieldValue("country", ''+component.long_name)
            break;
        }
      }
      setFieldValue("street", ''+address1)
      console.log(place)
      console.log(values)
      // After filling the form with address components from the Autocomplete
      // prediction, set cursor focus on the second address line to encourage
      // entry of subpremise information such as apartment, unit, or floor number.
    }
 
     return(
    <>
        
      <Formik
        initialValues={{...addressInfo}}
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
            if(setOrderAddress)
              setOrderAddress({...values})
            if(signInCheckResult.signedIn === true){
              if(addressId){
                setDoc(doc(db, "addresses", addressId), {
                  ...values
                },{merge:true})
                .then(()=> console.log('address updated'))
              .catch((e)=>console.log(e))
              }
              else{
             addDoc(collection(db, "addresses"), {
                user:user.uid,
                dateCreated:serverTimestamp(),
                ...values
              })
              .then(()=> console.log('address added'))
              .catch((e)=>console.log(e))
            }
          }
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting,setFieldValue,handleChange,values }) => (
          <Form style={{width:'500px',display:'flex',flexWrap:'wrap'}}>
            <InputWrapper>
                <Label for='firstname' >First Name</Label>
                <Input onChange={handleChange} value={values.firstname} type="text" name="firstname"  id='firstname' />
            </InputWrapper>
            <InputWrapper>
                <Label for='lastname' >Last Name</Label>
                <Input onChange={handleChange} value={values.lastname} type="text" name="lastname"  id='lastname' />
            </InputWrapper>
            <InputWrapper wide>
                <Label for='email' >Email</Label>
                <Input onChange={handleChange} value={values.email} type="email" name="email" id="email" />
                <ErrorMessage name="email" component="div" />
            </InputWrapper>
            <InputWrapper wide>
            <Label for='phone' >Phone Number</Label>
            <PhoneInput country='gh' onChange={(value,country,e)=>handleChange(e)} 
            value={values.phone} inputProps={{name:"phone"}} type="text"  id="phone" 
            dropdownStyle={{...dropDownStyle}} inputStyle={{...reactTextInput}}/>
            </InputWrapper>
            <InputWrapper wide>
            <Label for='location' >Location</Label>
            <GSelect
            id="location"
            placeholder="Search Location"
            value={values.location}
            apiKey='AIzaSyBriNCuhss3BduhnE7R7zAuqxSGFez3vs8'
            options={{
              types: [],
              fields: ["address_components", "geometry", "icon", "name","formatted_address"],
              componentRestrictions: { country: "gh" },
            }}
            onPlaceSelected={(place) =>{
              setFieldValue("location",`${place.name}, ${place.formatted_address}`)
              setAddress(place,setFieldValue,values)
              console.log(values)
            }
            }
            onChange={handleChange}/>
            </InputWrapper>
            <InputWrapper>
                <Label for="street" >Street</Label>
                <Input onChange={handleChange} value={values.street}  type="text" name="street" id="street" />
            </InputWrapper>
            <InputWrapper>
                <Label for='city' >City</Label>
                <Input onChange={handleChange} value={values.city} type="text" name="city" id="city"  />
            </InputWrapper>
            <InputWrapper>
                <Label for='state' >State</Label>
                <Input onChange={handleChange} value={values.state} type="text" name="state" id="state"/>
            </InputWrapper>
            <InputWrapper>
                <Label for='country' >Country</Label>
                <Input onChange={handleChange} value={values.country}  type="text" name="country" id="country"/>
            </InputWrapper>
            <InputWrapper style={{display:'flex',justifyContent:'flex-end'}} >
            <Button secondary onClick={()=>setShowModal(false)} type='button'
              style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >CANCEL</Button>
              <Button primary type='submit'  disabled={isSubmitting}
              style={{width:100,display:'flex',margin:'10px', height:40, fontSize:16,alignItems:'center',justifyContent:'center'}} >DONE</Button>
              </InputWrapper>       
          </Form>
        )}
      </Formik>
    </>
  )}
  

  