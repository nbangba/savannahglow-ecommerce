import React,{ useState,useEffect } from 'react'
import { Button, TextAreaInput } from './addressform';
import { Formik,Form,Field,ErrorMessage} from 'formik';
import { useSigninCheck,useUser,useFirestore,useFirestoreCollectionData, useFirestoreCollection,useAuth} from 'reactfire';
import { collection, addDoc, serverTimestamp,doc, setDoc,query,where} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { Input,Label,InputWrapper } from './addressform';
import { Rating } from 'react-simple-star-rating'
import { rateProduct } from '../helperfunctions/cloudfunctions';
import { Card } from './card';
import { CardItem } from './addresscard';
import { Button as Butt } from './navbar'
import Edit from '../images/edit.svg'

export default function Review({productName,productId,user}) {
    const fs = useFirestore()
    const auth = useAuth();
    const ref = collection(fs,'reviews')
    const [reviewQuery, setReviewQuery] = useState(query(ref,where('userId','==','none')))
    //const [yourReview, setYourReview] = useState(null)
    const{data:yourReviewArray} = useFirestoreCollectionData(reviewQuery)
    const allOtherReviewsQuery = user? query(ref,where('userId','!=',user.uid)):query(ref)
    const {data:allOtherReviews} = useFirestoreCollectionData(allOtherReviewsQuery)
     console.log(yourReviewArray[0])
     console.log(user)
    const [yourReview, setYourReview] = useState({
      name:user&&user.displayName?user.displayName:'',
      email:user&&user.email?user.email:'',
      rating:yourReviewArray[0] && yourReviewArray[0].rating?yourReviewArray[0].rating:0,
      review:yourReviewArray[0]&&yourReviewArray[0].review?yourReviewArray[0].review:''
    }) 
    const [editReview, setEditReview] = useState(false)

     useEffect(() => {
       if(user){
        setReviewQuery(query(ref,where('userId','==',user.uid))) 
       }
       else{
        setReviewQuery(query(ref,where('userId','==','none')))
       }
     }, [user])
     
     useEffect(() => {
      if(yourReviewArray.length>0){
      setYourReview({...yourReviewArray[0],review:yourReviewArray[0].review,rating:yourReviewArray[0].rating,reviewId:yourReviewArray[0].NO_ID_FIELD})
      console.log(yourReviewArray)
      }
      else{
        setYourReview({name:user&&user.displayName?user.displayName:'',rating:0,review:'',email:user&&user.email?user.email:''})
      }
     }, [yourReviewArray])
    
    return (
      <>
        <section className='bottom'>
          <div className='description' style={{paddingInlineStart:10}}>User Reviews</div>
            {allOtherReviews && allOtherReviews.map((review)=> <UserReview review={review} key={review.NO_ID_FIELD}/>)}
        </section>
        <section style={{width:'100%'}} className='top'>
          <div className='description' style={{paddingInlineStart:10}}>Your Review</div>
          {
          yourReviewArray.length>0 && !editReview?
          <UserReview review={yourReviewArray[0]} user={user} setEditReview={setEditReview}/>:
          <Formik
          enableReinitialize = {true}
          initialValues = {yourReview}
          validate = {values => {
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
            values.productName =  productName;
            values.productId = productId;
            
            console.log(JSON.stringify(values, null, 2));
            if(!yourReview.reviewId){
              console.log(yourReview)
            if(user){
              console.log(user)
              values.userId= user.uid;
              rateProduct(values)
            }
            else{
              signInAnonymously(auth)
              .then((newUser)=>{
                console.log(newUser)
                values.userId= newUser.user.uid;
                rateProduct(values)
              })
            }
          }
          else{
            values.userId= user.uid;
            values.reviewId = yourReview.reviewId;
            values.previousRating = yourReview.rating;
            rateProduct(values)
          }
          setEditReview(false)
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting,setFieldValue,handleChange,values }) => (
          
          <Form style={{maxWidth:'500px',display:'flex',flexWrap:'wrap'}}>
              <InputWrapper>
              {<Rating onClick={(r)=>setFieldValue('rating',r)} transition  ratingValue={values.rating/20.0} style={{width:'fit-content'}} key={values.review} />}
              </InputWrapper>
             { (!user || user.isAnonymous) &&
             <>
            <InputWrapper style={{minWidth:'100%'}}>
                <Label for='name' > Name</Label>
                <Input onChange={handleChange} value={values.name} type="text" name="name"  id='name' />
            </InputWrapper>
          
            <InputWrapper wide>
                <Label for='email' >Email</Label>
                <Input onChange={handleChange} value={values.email} type="email" name="email" id="email" />
                <ErrorMessage name="email" component="div" />
            </InputWrapper>
            </>
            }
            <InputWrapper style={{minWidth:'100%'}}>
                <Label for='review' >Your Review</Label>
               
                <TextAreaInput onChange={handleChange} value={values.review} rows='5' name="review" id="review" />
            </InputWrapper>
            <div style={{width:'100%',display:'flex'}}>
            <Button type='button' onClick={()=>setEditReview(false)}>Cancel</Button>
            <Button type='submit'>Submit</Button>
            </div>
            {console.log(values)}
          </Form>
        )}
      </Formik>
      } 
      </section>
      
        </>
    )
}

function UserReview({review,user,setEditReview}){
  const rating = review.rating/20.0
  return(
    <Card style={{borderRadius:5 ,maxWidth:500}}>
       <CardItem style={{fontWeight:'bold'}}>{review.name}</CardItem>
       <Rating ratingValue={rating} size={20} allowHalfIcon readonly style={{width:'fit-content'}} key={review.review}/>
       <CardItem>{review.review}</CardItem>
       {(user&&user.uid==review.userId)&&<CardItem onClick={()=>setEditReview(true)}><Butt secondary><Edit fill="#474E52" style={{width:20,height:20}}/>Edit</Butt></CardItem>}
    </Card>
  )
}