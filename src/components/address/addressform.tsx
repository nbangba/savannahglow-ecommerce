import React from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import styled, { css } from 'styled-components'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Autocomplete from 'react-google-autocomplete'
import {
    useSigninCheck,
    useUser,
    useFirestore,
    useFirestoreCollectionData,
} from 'reactfire'
import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    setDoc,
    where,
    query,
    orderBy,
    FieldValue,
} from 'firebase/firestore'
import * as Yup from 'yup'
import { Button } from '../layout/navbar'
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

export const reactTextInput = {
    width: '100%',
    padding: '12px 20px',
    paddingLeft: '48px',
    margin: '8px 0',
    display: 'inline-block',
    border: '1px solid #35486F',
    borderRadius: '4px',
    BoxSizing: 'border-box',
    background: '#f4ece6',
    fontFamily: `'Montserrat', sans-serif`,
    fontSize: '16px',
    fontWeight: '400',
    color: '#474E52',
    height: 'fit-content',

    '&:focus': {
        outline: 'none',
        border: '2px solid #35486F',
        boxShadow: '0 0 10px #9bb2e1',
    },
}

export const dropDownStyle = {
    border: '1px solid #556585',
    backgroudColor: '#f4ece6',
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
    font-size: 16px;
    font-weight: 400;
    color: #35486f;
`
export const InputWrapper = styled.div`
    width: 50%;
    padding: 15px;
    flex: 1 0 50%;
    min-width: 200px;
    box-sizing: border-box;
    ${(props: { wide?: boolean }) =>
        props.wide &&
        css`
            flex: 1 0 100%;
        `}
`

/*export const Button = styled.button`
    position: relative;
    color: #35486f;
    display: block;
    cursor: pointer;
    width: 100px;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 0.5rem;
    margin: 0 10px;
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    &:hover {
        color: white;
        background: #13213d;
        transition: background 0.3s ease-out;
        mix-blend-mode: normal;
    }

    ${(props: { primary?: boolean; secondary?: boolean }) =>
        props.primary &&
        css`
            background-color: #35486f;
            color: white;

            &:hover {
                color: white;
                background: #13213d;
                transition: background 0.3s ease-out;
                font-weight: bold;
                mix-blend-mode: normal;
            }
        `}
    ${(props) =>
        props.secondary &&
        css`
            border: white solid 0px;
            text-align: center;
            background-color: rgba(224, 193, 175, 0.5);
            &:hover {
                background-color: rgba(224, 193, 175, 0.9);
                color: #35486f;
                font-weight: bold;
                transition: background 0.3s ease-out;
            }
        `}
`*/
export interface AddressInfoProps {
    firstname: string
    lastname: string
    email: string
    phone: string
    location: string
    street?: string
    city?: string
    state?: string
    country: string
    NO_ID_FIELD?: string
    isDefault?: boolean
    loc?: { lat: string; lng: string }
}

interface AddressFormProps {
    setShowModal: (showModal: boolean) => void
    addressInfo?: AddressInfoProps
}

interface AdrressInfoFSProps extends AddressInfoProps {
    dateCreated: FieldValue
    user: string | null
}

export default function AddressForm({
    setShowModal,
    addressInfo = {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        location: '',
        street: '',
        city: '',
        state: '',
        country: '',
        loc: { lat: '', lng: '' },
    },
}: AddressFormProps) {
    const db = useFirestore()
    const { status, data: signInCheckResult } = useSigninCheck()
    const { status: info, data: user } = useUser()
    const addressId = addressInfo.NO_ID_FIELD
    const addressesCollection = collection(db, 'addresses')
    const addressesQuery = query(
        addressesCollection,
        orderBy('dateCreated', 'desc'),
        where('user', '==', user ? user.uid : 'NO_USER')
    )
    const { data: addresses } = useFirestoreCollectionData(addressesQuery)

    console.log(addresses)
    const setAddress = (
        place: any,
        setFieldValue: (name: string, value: string) => void,
        values: any
    ) => {
        let address1 = ''
        let postcode = ''
        for (const component of place.address_components) {
            const componentType = component.types[0]

            switch (componentType) {
                case 'street_number': {
                    address1 = `${component.long_name} ${address1}`
                    break
                }

                case 'route': {
                    address1 += ` ${component.short_name}`
                    break
                }

                case 'postal_code': {
                    postcode = `${component.long_name}${postcode}`
                    break
                }

                case 'postal_code_suffix': {
                    postcode = `${postcode}-${component.long_name}`
                    break
                }
                case 'locality':
                    setFieldValue('city', '' + component.long_name)
                    break

                case 'administrative_area_level_1': {
                    setFieldValue('state', '' + component.short_name)
                    break
                }
                case 'country':
                    setFieldValue('country', '' + component.long_name)
                    break
            }
        }
        setFieldValue('street', '' + address1)
        console.log(place)
        console.log(values)
        // After filling the form with address components from the Autocomplete
        // prediction, set cursor focus on the second address line to encourage
        // entry of subpremise information such as apartment, unit, or floor number.
    }

    const phoneRegExp =
        /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/

    const addressSchema = Yup.object().shape({
        firstname: Yup.string().required('First name is required'),
        lastname: Yup.string().required('Last name is required'),
        email: Yup.string().email().required('Email is required'),
        phone: Yup.string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .required('Phone number required'),
        location: Yup.string().required('A location is required'),
    })

    return (
        <>
            <Formik
                initialValues={{ ...addressInfo }}
                validationSchema={addressSchema}
                onSubmit={(values: any, { setSubmitting }: any) => {
                    setTimeout(() => {
                        console.log(JSON.stringify(values, null, 2))

                        if (signInCheckResult.signedIn === true) {
                            if (addressId) {
                                setDoc(
                                    doc(db, 'addresses', addressId),
                                    {
                                        ...values,
                                    },
                                    { merge: true }
                                )
                                    .then(() => {
                                        console.log('address updated')
                                        setShowModal(false)
                                    })
                                    .catch((e) => console.log(e))
                            } else if (addresses && addresses.length == 0) {
                                addDoc(collection(db, 'addresses'), {
                                    user: user && user.uid,
                                    dateCreated: serverTimestamp(),
                                    isDefault: true,
                                    ...values,
                                })
                                    .then(() => {
                                        console.log('address added')
                                        setShowModal(false)
                                    })
                                    .catch((e) => console.log(e))
                            } else {
                                addDoc(collection(db, 'addresses'), {
                                    user: user && user.uid,
                                    dateCreated: serverTimestamp(),
                                    ...values,
                                })
                                    .then(() => {
                                        console.log('address updated')
                                        setShowModal(false)
                                    })
                                    .catch((e) => console.log(e))
                            }
                        }
                        setSubmitting(false)
                    }, 400)
                }}
            >
                {({
                    isSubmitting,
                    setFieldValue,
                    handleChange,
                    values,
                    handleSubmit,
                    submitForm,
                }: any) => (
                    <Form
                        onSubmit={handleSubmit}
                        id="address"
                        style={{
                            width: '500px',
                            display: 'flex',
                            flexWrap: 'wrap',
                        }}
                    >
                        <InputWrapper>
                            <Label htmlFor="firstname">First Name</Label>
                            <Input
                                onChange={handleChange}
                                value={values.firstname}
                                type="text"
                                name="firstname"
                                id="firstname"
                            />
                            <ErrorMessage name="firstname" component="div" />
                        </InputWrapper>
                        <InputWrapper>
                            <Label htmlFor="lastname">Last Name</Label>
                            <Input
                                onChange={handleChange}
                                value={values.lastname}
                                type="text"
                                name="lastname"
                                id="lastname"
                            />
                            <ErrorMessage name="lastname" component="div" />
                        </InputWrapper>
                        <InputWrapper wide>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                onChange={handleChange}
                                value={values.email}
                                type="email"
                                name="email"
                                id="email"
                            />
                            <ErrorMessage name="email" component="div" />
                        </InputWrapper>
                        <InputWrapper wide>
                            <Label htmlFor="phone">Phone Number</Label>
                            <PhoneInput
                                country="gh"
                                onChange={(value, country, e) =>
                                    handleChange(e)
                                }
                                value={values.phone}
                                inputProps={{ name: 'phone' }}
                                dropdownStyle={{ ...dropDownStyle }}
                                inputStyle={{ ...reactTextInput }}
                            />
                            <ErrorMessage name="phone" component="div" />
                        </InputWrapper>
                        <InputWrapper wide>
                            <Label htmlFor="location">Location</Label>
                            <GSelect
                                id="location"
                                placeholder="Search Location"
                                apiKey={`${process.env.FIREBASE_API_KEY}`}
                                options={{
                                    types: [],
                                    fields: [
                                        'address_components',
                                        'geometry',
                                        'icon',
                                        'name',
                                        'formatted_address',
                                    ],
                                    componentRestrictions: { country: 'gh' },
                                }}
                                onPlaceSelected={(place: any) => {
                                    setFieldValue(
                                        'location',
                                        `${place.name}, ${place.formatted_address}`
                                    )
                                    setFieldValue('loc', {
                                        lat: place.geometry.location.lat(),
                                        lng: place.geometry.location.lng(),
                                    })
                                    setAddress(place, setFieldValue, values)
                                    console.log(place.geometry.location.lat())
                                }}
                                onChange={handleChange}
                            />
                            <ErrorMessage name="location" component="div" />
                        </InputWrapper>
                        <InputWrapper>
                            <Label htmlFor="street">Street</Label>
                            <Input
                                onChange={handleChange}
                                value={values.street}
                                type="text"
                                name="street"
                                id="street"
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Label htmlFor="city">City</Label>
                            <Input
                                onChange={handleChange}
                                value={values.city}
                                type="text"
                                name="city"
                                id="city"
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Label htmlFor="state">State</Label>
                            <Input
                                onChange={handleChange}
                                value={values.state}
                                type="text"
                                name="state"
                                id="state"
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Label htmlFor="country">Country</Label>
                            <Input
                                onChange={handleChange}
                                value={values.country}
                                type="text"
                                name="country"
                                id="country"
                            />
                        </InputWrapper>
                        <InputWrapper
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Button
                                secondary
                                onClick={() => setShowModal(false)}
                                type="button"
                                style={{
                                    width: 100,
                                    display: 'flex',
                                    margin: '10px',
                                    height: 40,
                                    fontSize: 16,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                CANCEL
                            </Button>
                            <Button
                                primary
                                disabled={isSubmitting}
                                form="address"
                                onClick={handleSubmit}
                                style={{
                                    width: 100,
                                    display: 'flex',
                                    margin: '10px',
                                    height: 40,
                                    fontSize: 16,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                DONE
                            </Button>
                        </InputWrapper>
                    </Form>
                )}
            </Formik>
        </>
    )
}
