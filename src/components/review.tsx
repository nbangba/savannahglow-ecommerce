import React,{ useState,useEffect } from 'react'
import { Button, TextAreaInput } from './addressform';
import { Formik,Form,Field,ErrorMessage} from 'formik';
import { useSigninCheck,useUser,useFirestore,useFirestoreCollectionData, useFirestoreCollection,useAuth, ObservableStatus} from 'reactfire';
import { collection, addDoc, serverTimestamp,doc, setDoc,query,where} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { Input,Label,InputWrapper } from './addressform';
import { Rating } from 'react-simple-star-rating'
import { rateProduct } from '../helperfunctions/cloudfunctions';
import { Card } from './card';
import { CardItem } from './addresscard';
import { Button as Butt } from './navbar'
import Edit from '../images/svgs/edit.svg'
import * as Yup from 'yup'

interface ReviewComponentProps{
  productName:string,
  productId:string,
  user:any,
} 

export interface ReviewProps{
  name?:string,
  email?:string,
  rating:number,
  previousRating?:number,
  review:string,
  reviewId?:string,
  userId?:string,
  NO_ID_FIELD?:string,
  productName?:string,
  productId?:string,

}

/* create user reviews and ratings
*/
export default function Review({productName,productId,user}:ReviewComponentProps) {
    const fs = useFirestore()
    const auth = useAuth();
    const ref = collection(fs,'reviews')
    const [reviewQuery, setReviewQuery] = useState(query(ref,where('userId','==','none')))
    //const [yourReview, setYourReview] = useState(null)
    const{data:yourReviewArray} = useFirestoreCollectionData(reviewQuery)as ObservableStatus<ReviewProps[]>
    const allOtherReviewsQuery = user? query(ref,where('userId','!=',user.uid)):query(ref)
    const {data:allOtherReviews} = useFirestoreCollectionData(allOtherReviewsQuery)as ObservableStatus<ReviewProps[]>
     console.log(yourReviewArray[0])
     console.log(user)
    const [yourReview, setYourReview] = useState<ReviewProps>({
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
    
     const ratingSchema = Yup.object().shape({
      rating: Yup.number().min(1).required('Rating Required'),
      name: Yup.string().required('Name required'),
    });

    
    return (
      <>
        <section className='bottom'>
          <div className='description' style={{paddingInlineStart:10}}>User Reviews</div>
            {allOtherReviews && allOtherReviews.map((review)=> <UserReview review={review} key={review.NO_ID_FIELD}/>)}
        </section>
        <section style={{width:'100%'}} className='top'>
          <div className='description' style={{paddingInlineStart:10}}>{editReview?"Your Rating":"Your review"}</div>
          {
          yourReviewArray.length>0 && !editReview?
          <UserReview review={yourReviewArray[0]} user={user} setEditReview={setEditReview}/>:
          <Formik
          enableReinitialize = {true}
          initialValues = {yourReview}
          validationSchema={ratingSchema}
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
        {({isSubmitting,setFieldValue,handleChange,values,handleReset }) => (
          <Form style={{maxWidth:'500px',display:'flex',flexWrap:'wrap'}}>
              <InputWrapper>
              {<Rating onClick={(r)=>setFieldValue('rating',r)} transition  ratingValue={values.rating/20.0} style={{width:'fit-content'}} key={values.review} />}
              <ErrorMessage name="rating" component="div" />
              </InputWrapper>
             { (!user || user.isAnonymous) &&
            <>
              <InputWrapper style={{minWidth:'100%'}}>
                  <Label  > Name</Label>
                  <Input onChange={handleChange} value={values.name} type="text" name="name"  id='name' />
                  <ErrorMessage name="name" component="div" />
              </InputWrapper>
            
              <InputWrapper wide>
                  <Label  >Email</Label>
                  <Input onChange={handleChange} value={values.email} type="email" name="email" id="email" />
                  <ErrorMessage name="email" component="div" />
              </InputWrapper>
            </>
            }
            <InputWrapper style={{minWidth:'100%'}}>
                <Label  >Your Review</Label>
                <TextAreaInput onChange={handleChange} value={values.review} rows={5} name="review" id="review" />
            </InputWrapper>
            <div style={{width:'100%',display:'flex'}}>
            <Button secondary type='button' onClick={handleReset}>Reset</Button>
            {yourReviewArray.length>0 && <Button secondary type='button' onClick={()=>setEditReview(false)}>Cancel</Button>}
            <Button primary type='submit'>Submit</Button>
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

interface UserReviewProps{
  review: ReviewProps,
  user?:any,
  setEditReview?:(edtitReview:boolean)=> void
}
function UserReview({review,user,setEditReview}:UserReviewProps){
  const rating = review.rating/20.0
  return(
    <Card style={{borderRadius:5 ,maxWidth:500}}>
       <CardItem style={{fontWeight:'bold'}}>{review.name}</CardItem>
       <Rating ratingValue={rating} size={20} allowHalfIcon readonly style={{width:'fit-content'}} key={review.review+review.rating}/>
       <CardItem>{review.review}</CardItem>
       {(user&&user.uid==review.userId)&&<CardItem ><Butt secondary onClick={()=>{if(setEditReview){setEditReview(true)}}}><Edit fill="#474E52" style={{width:20,height:20}}/>Edit</Butt></CardItem>}
    </Card>
  )
}