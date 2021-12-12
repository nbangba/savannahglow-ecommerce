import React,{ useState } from 'react'
import { TextAreaInput } from './addressform';
import { Formik,Form,Field,ErrorMessage} from 'formik';
import { useSigninCheck,useUser,useFirestore} from 'reactfire';
import { collection, addDoc, serverTimestamp,doc, setDoc } from "firebase/firestore";
import { Input,Label,InputWrapper } from './addressform';
import { Rating } from 'react-simple-star-rating'

export default function Review() {
    const [ratingValue, setRatingValue] = useState(0)
    
    return (
        <div>
            <Formik
        initialValues={{name:'',email:'',rating:0,review:''}}
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
          
        }}
      >
        {({ isSubmitting,setFieldValue,handleChange,values }) => (
          <Form style={{width:'500px',display:'flex',flexWrap:'wrap'}}>
              <InputWrapper>
              <Rating onClick={(r)=>setFieldValue('rating',r)} ratingValue={values.rating} style={{width:'fit-content'}} />
              </InputWrapper>
 
            <InputWrapper style={{minWidth:'100%'}}>
                <Label for='name' > Name</Label>
                <Input onChange={handleChange} value={values.firstname} type="text" name="name"  id='name' />
            </InputWrapper>
          
            <InputWrapper wide>
                <Label for='email' >Email</Label>
                <Input onChange={handleChange} value={values.email} type="email" name="email" id="email" />
                <ErrorMessage name="email" component="div" />
            </InputWrapper>
            <InputWrapper>
                <Label for='message' >Message</Label>
                <Field as='textarea' rows='5' type="text" name="review" id="message" component={TextAreaInput} />
            </InputWrapper>
            
              
          </Form>
        )}
      </Formik>
            
        </div>
    )
}
