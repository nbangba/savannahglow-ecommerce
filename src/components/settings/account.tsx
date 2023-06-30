import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { Input, dropDownStyle, reactTextInput } from '../address/addressform'
import { InputWrapper } from '../address/addressform'
import { Label } from '../address/addressform'
import { Button } from '../layout/navbar'
import styled from 'styled-components'
import Reauth from '../reauth'
import ModalComponent from '../supportingui/modal'
//import firebase from '../firebase/fbconfig';
import ShowPassword from '../../images/svgs/show-password.svg'
import HidePassword from '../../images/svgs/hide-password.svg'
import * as Yup from 'yup'
//import { useFirestoreConnect } from 'react-redux-firebase';
//import { useSelector } from 'react-redux';
import { useUser, useAuth } from 'reactfire'
import {
    updateEmail,
    updatePassword,
    deleteUser,
    updatePhoneNumber,
    updateCurrentUser,
    updateProfile,
    RecaptchaVerifier,
    PhoneAuthProvider,
} from 'firebase/auth' // Firebase v9+
import { ErrorMessage } from 'formik'
import PhoneInput from 'react-phone-input-2'

const LinkButton = styled.div`
    width: 100%;
    max-width: 800px;
    padding: 10px;
    margin: 10px;
    font-family: 'Montserrat', sans-serif;
    color: #35486f;
    cursor: pointer;
    &:hover {
        color: #1e52bc;
    }
`
export default function Account() {
    const [updateProfile, setUpdateProfile] = useState(false)
    const [updatePhoneNumber, setUpdatePhoneNumber] = useState(false)
    const [changeEmail, setChangeEmail] = useState(false)
    const [changePassword, setChangePassword] = useState(false)
    const [deleteAccount, setDeleteAccount] = useState(false)
    return (
        <div>
            <LinkButton onClick={() => setUpdateProfile(true)}>
                Change Display Name
            </LinkButton>
            <LinkButton onClick={() => setUpdatePhoneNumber(true)}>
                Update Phone Number
            </LinkButton>
            <LinkButton onClick={() => setChangeEmail(true)}>
                Change Email
            </LinkButton>
            <LinkButton onClick={() => setChangePassword(true)}>
                Change Password
            </LinkButton>
            <LinkButton onClick={() => setDeleteAccount(true)}>
                Delete Account
            </LinkButton>
            <ModalComponent
                width="600px"
                showModal={updateProfile}
                title="Update Profile"
            >
                <UpdateProfile setShowModal={setUpdateProfile} />
            </ModalComponent>
            <ModalComponent
                width="600px"
                showModal={updatePhoneNumber}
                title="Update Profile"
            >
                <UpdatePhoneNumber setShowModal={setUpdatePhoneNumber} />
            </ModalComponent>
            <ModalComponent
                width="600px"
                showModal={changeEmail}
                title="Change Email"
            >
                <ChangeEmail setShowModal={setChangeEmail} />
            </ModalComponent>
            <ModalComponent
                width="600px"
                showModal={changePassword}
                title="Change Password"
            >
                <ChangePassword setShowModal={setChangePassword} />
            </ModalComponent>
            <ModalComponent showModal={deleteAccount} title="Delete Account">
                <DeleteAccount setShowModal={setDeleteAccount} />
            </ModalComponent>
        </div>
    )
}

function UpdateProfile({ setShowModal }: ChangeMailProps) {
    const { data: user } = useUser()

    const personalInfoSchema = Yup.object().shape({
        displayName: Yup.string().required('Display name is required'),
    })
    return (
        <Formik
            initialValues={{
                displayName: (user && user.displayName) || '',
            }}
            validationSchema={personalInfoSchema}
            //Remember to add yup for  validation check.
            onSubmit={(values: any, { setSubmitting }: any) => {
                setTimeout(() => {
                    console.log(JSON.stringify(values, null, 2))
                    if (user)
                        updateProfile(user, values)
                            .then(() => {
                                console.log(
                                    `Display name updated to ${values.displayName} successfully`
                                )
                                setShowModal(false)
                            })
                            .catch((error) => {
                                // An error occurred
                                // ...
                                console.log(error)
                            })
                    setSubmitting(false)
                }, 400)
            }}
        >
            {({ isSubmitting, setFieldValue, handleChange, values }: any) => (
                <Form
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        width: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <InputWrapper>
                        <Label>Display Name</Label>
                        <Input
                            onChange={handleChange}
                            value={values.displayName}
                            type="text"
                            name="displayName"
                            id="displayName"
                        />
                        <ErrorMessage name="displayName" component="div" />
                    </InputWrapper>

                    <InputWrapper
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <Button
                            secondary
                            type="button"
                            onClick={() => {
                                setShowModal(false)
                            }}
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
                            type="submit"
                            disabled={isSubmitting}
                            onClick={() => {}}
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
                            SEND
                        </Button>
                    </InputWrapper>
                </Form>
            )}
        </Formik>
    )
}
function UpdatePhoneNumber({ setShowModal }: ChangeMailProps) {
    const auth = useAuth()
    const provider = new PhoneAuthProvider(auth)

    const [verificationId, setVerificationId] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [currentUI, setCurrentUI] = useState(
        <VerifyPhoneNumber
            provider={provider}
            setVerificationId={setVerificationId}
            setShowModal={setShowModal}
            setPhoneNumber={setPhoneNumber}
        />
    )
    useEffect(() => {
        if (verificationId.length > 0)
            setCurrentUI(
                <VerifyCode
                    verificationId={verificationId}
                    setShowModal={setShowModal}
                    phoneNumber={phoneNumber}
                />
            )
    }, [verificationId])

    // Obtain the verificationCode from the user.

    return <>{currentUI}</>
}
function VerifyPhoneNumber({
    provider,
    setVerificationId,
    setShowModal,
    setPhoneNumber,
}: any) {
    const { data: user } = useUser()
    const auth = useAuth()
    const [applicationVerifier, setApplicationVerifier] = useState<any>(null)

    // Obtain the verificationCode from the user.
    const phoneRegExp =
        /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/
    const personalInfoSchema = Yup.object().shape({
        phoneNumber: Yup.string().matches(
            phoneRegExp,
            'Phone number is not valid'
        ),
    })

    useEffect(() => {
        const verifier = new RecaptchaVerifier(
            'recapture',
            {
                size: 'invisible',
            },
            auth
        )
        window.recaptchaVerifier = verifier
        setApplicationVerifier(verifier)
    }, [])

    return (
        <Formik
            initialValues={{
                phoneNumber: (user && user.phoneNumber) || '',
            }}
            validationSchema={personalInfoSchema}
            //Remember to add yup for  validation check.
            onSubmit={(values: any, { setSubmitting, setFieldError }: any) => {
                setTimeout(() => {
                    setSubmitting(true)
                    console.log(JSON.stringify(values, null, 2))
                    if (user) {
                        provider
                            .verifyPhoneNumber(
                                values.phoneNumber,
                                applicationVerifier
                            )
                            .then((verificationId: any) => {
                                console.log('verificationid', verificationId)
                                if (
                                    verificationId &&
                                    verificationId.length > 0
                                ) {
                                    setPhoneNumber(values.phoneNumber)
                                    setVerificationId(verificationId)
                                } else {
                                    setFieldError(
                                        'phoneNumber',
                                        `Failed to get verification id. Try again.`
                                    )
                                    setSubmitting(false)
                                }
                            })
                            .catch((error: any) => {
                                // An error occurred
                                // ...
                                setFieldError(
                                    'phoneNumber',
                                    `Failed to get verification id. Try again.${error.message}`
                                )
                                setSubmitting(false)
                                console.log(error)
                            })
                    }
                }, 400)
            }}
        >
            {({ isSubmitting, setFieldValue, handleChange, values }: any) => (
                <Form
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        width: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <InputWrapper>
                        <Label>Phone Number</Label>
                        <PhoneInput
                            country={'gh'}
                            onChange={(value, country, e) => handleChange(e)}
                            value={values.phoneNumber}
                            inputProps={{ name: 'phoneNumber' }}
                            dropdownStyle={{ ...dropDownStyle }}
                            inputStyle={{ ...reactTextInput }}
                        />
                        <ErrorMessage name="phoneNumber" component="div" />
                    </InputWrapper>

                    <InputWrapper
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <Button
                            secondary
                            type="button"
                            onClick={() => {
                                setShowModal(false)
                            }}
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
                            id="recapture"
                            primary
                            type="submit"
                            disabled={isSubmitting}
                            onClick={() => {}}
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
                            {isSubmitting ? 'Please Wait' : 'SEND'}
                        </Button>
                    </InputWrapper>
                </Form>
            )}
        </Formik>
    )
}

function VerifyCode({ verificationId, setShowModal, phoneNumber }: any) {
    const { data: user } = useUser()

    // Obtain the verificationCode from the user.
    const codeSchema = Yup.object().shape({
        code: Yup.number().required('Code is required.'),
    })
    return (
        <Formik
            initialValues={{
                code: '',
            }}
            validationSchema={codeSchema}
            //Remember to add yup for  validation check.
            onSubmit={(values: any, { setSubmitting, setFieldError }: any) => {
                setTimeout(() => {
                    console.log(JSON.stringify(values, null, 2))
                    setSubmitting(true)
                    if (user) {
                        const phoneCredential = PhoneAuthProvider.credential(
                            verificationId,
                            values.code
                        )
                        if (phoneCredential)
                            updatePhoneNumber(user, phoneCredential)
                                .then((result) => {
                                    console.log(
                                        `Phone number updated result`,
                                        result
                                    )
                                    setShowModal(false)
                                })
                                .catch((error) => {
                                    // An error occurred
                                    // ...
                                    console.log(error)
                                    setFieldError(
                                        'code',
                                        'Something went wrong'
                                    )
                                    setSubmitting(false)
                                })
                        else {
                            setFieldError('code', 'You entered the wrong code')
                            setSubmitting(false)
                        }
                    }
                }, 400)
            }}
        >
            {({ isSubmitting, setFieldValue, handleChange, values }: any) => (
                <Form
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        width: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <InputWrapper>
                        <Label>Verification Code</Label>
                        <Input
                            onChange={handleChange}
                            value={values.displayName}
                            type="text"
                            name="code"
                            id="code"
                        />
                        <span>{`Enter  text message code sent to ${phoneNumber}`}</span>
                        <ErrorMessage name="code" component="div" />
                    </InputWrapper>

                    <InputWrapper
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <Button
                            secondary
                            type="button"
                            onClick={() => {
                                setShowModal(false)
                            }}
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
                            type="submit"
                            disabled={isSubmitting}
                            onClick={() => {}}
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
                            {isSubmitting ? 'Please Wait' : 'SEND'}
                        </Button>
                    </InputWrapper>
                </Form>
            )}
        </Formik>
    )
}
interface ChangeMailProps {
    setShowModal: (showModal: boolean) => void
}
function ChangeEmail({ setShowModal }: ChangeMailProps) {
    //const user = firebase.auth().currentUser;
    const { data: user } = useUser()
    const [reauth, setReauth] = useState(false)
    const [success, setSuccess] = useState(false)
    const emailSchema = Yup.object().shape({
        email: Yup.string().email().required('Email is required'),
    })
    return (
        <Formik
            initialValues={{ email: (user && user.email) || '' }}
            //Remember to validate with YUP
            validationSchema={emailSchema}
            onSubmit={(values: any, { setSubmitting }: any) => {
                setTimeout(() => {
                    console.log(JSON.stringify(values, null, 2))
                    if (user)
                        updateEmail(user, values.email)
                            .then(() => {
                                setSuccess(true)
                                console.log(
                                    `email updated to ${values.email} successfully`
                                )
                            })
                            .catch((error) => {
                                // An error occurred
                                // ...
                                console.log(error)
                                setReauth(true)
                            })
                    setSubmitting(false)
                }, 400)
            }}
        >
            {({ isSubmitting, handleChange, values }: any) =>
                success ? (
                    <div>
                        You successfully changed your email to {values.email}
                    </div>
                ) : (
                    <Form
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: '100%',
                            overflow: 'hidden',
                            maxWidth: 500,
                            justifyContent: 'center',
                        }}
                    >
                        <InputWrapper wide>
                            <Label>New Email</Label>
                            <Input
                                onChange={handleChange}
                                value={values.email}
                                type="email"
                                name="email"
                            />
                        </InputWrapper>
                        <InputWrapper
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                            wide
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
                                type="submit"
                                disabled={isSubmitting}
                                onClick={() => {}}
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
                                SEND
                            </Button>
                        </InputWrapper>
                        {reauth && (
                            <InputWrapper>
                                <div>
                                    For Security Purpose Sign in and try again
                                </div>
                                <Reauth type="email" change={values.email} />
                            </InputWrapper>
                        )}
                    </Form>
                )
            }
        </Formik>
    )
}

function ChangePassword({ setShowModal }: ChangeMailProps) {
    //const user = firebase.auth().currentUser;
    const { data: user } = useUser()
    const [reauth, setReauth] = useState(false)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const passWordSchema = Yup.object().shape({
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password is too short'),
        confirmPassword: Yup.string()
            .required('Confirmation is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    })
    return (
        <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={passWordSchema}
            onSubmit={(values: any, { setSubmitting }: any) => {
                setTimeout(() => {
                    console.log(JSON.stringify(values, null, 2))
                    if (user)
                        updatePassword(user, values.password)
                            .then(() => {
                                setSuccess(true)
                                // Update successful.
                            })
                            .catch((error) => {
                                // An error ocurred
                                // ...
                                console.log(error)
                                setReauth(true)
                            })

                    setSubmitting(false)
                }, 400)
            }}
        >
            {({
                isSubmitting,
                setFieldValue,
                handleChange,
                handleSubmit,
                values,
                errors,
            }: any) =>
                success ? (
                    <div>You successfully changed your password</div>
                ) : (
                    <Form
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: '100%',
                            overflow: 'hidden',
                            maxWidth: '500px',
                            justifyContent: 'center',
                        }}
                    >
                        <InputWrapper style={{ maxWidth: '80%' }}>
                            <Label>New Password</Label>
                            <Input
                                onChange={handleChange}
                                value={values.password}
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                            />
                            {errors && errors.password}
                        </InputWrapper>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {showPassword ? (
                                <HidePassword
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    fill="#474E52"
                                    style={{ width: 60, height: 60 }}
                                />
                            ) : (
                                <ShowPassword
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    fill="#474E52"
                                    style={{ width: 60, height: 60 }}
                                />
                            )}
                        </div>
                        <InputWrapper style={{ maxWidth: '80%' }}>
                            <Label>Confirm Password</Label>
                            <Input
                                onChange={handleChange}
                                value={values.confirmPassword}
                                type="password"
                                name="confirmPassword"
                            />
                            {errors && errors.confirmPassword}
                        </InputWrapper>
                        <InputWrapper
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                maxWidth: '80%',
                            }}
                            wide
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
                                type="submit"
                                disabled={isSubmitting}
                                onClick={() => {}}
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
                                SEND
                            </Button>
                        </InputWrapper>
                        <>
                            {reauth && (
                                <InputWrapper>
                                    <div>
                                        For Security Purpose Sign in and try
                                        again
                                    </div>
                                    <Reauth type="email" />
                                </InputWrapper>
                            )}
                        </>
                    </Form>
                )
            }
        </Formik>
    )
}

function DeleteAccount({ setShowModal }: ChangeMailProps) {
    //const user = firebase.auth().currentUser;
    const { data: user } = useUser()
    const [reauth, setReauth] = useState(false)
    const [success, setSuccess] = useState(false)
    const termsSchema = Yup.object().shape({
        agree: Yup.string().required(
            'You must accept the terms and conditions'
        ),
    })
    return (
        <Formik
            initialValues={{ agree: 'agree' }}
            validationSchema={termsSchema}
            onSubmit={(values: any, { setSubmitting }: any) => {
                setTimeout(() => {
                    console.log(JSON.stringify(values, null, 2))
                    if (user)
                        deleteUser(user)
                            .then(() => {
                                setSuccess(true)
                                // User deleted.
                            })
                            .catch((error) => {
                                // An error ocurred
                                // ...
                                console.log(error)
                                setReauth(true)
                            })

                    setSubmitting(false)
                }, 400)
            }}
        >
            {({
                isSubmitting,
                setFieldValue,
                handleChange,
                handleSubmit,
                values,
                errors,
            }: any) =>
                success ? (
                    <div>You successfully deleted your account</div>
                ) : (
                    <Form
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: '100%',
                            overflow: 'hidden',
                            justifyContent: 'center',
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            By agreeing to this action, your account will be
                            deleted forever
                        </div>
                        <InputWrapper
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                flex: '1 0 100%',
                            }}
                        >
                            <label className="container">
                                <input
                                    type="checkbox"
                                    onChange={handleChange}
                                    value={values.agree}
                                    name="agree"
                                />
                                <span className="checkmark"></span>
                            </label>
                            <Label>I agree</Label>
                        </InputWrapper>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                flex: '1 0 100%',
                            }}
                        >
                            {errors && errors.agree}
                        </div>
                        <InputWrapper
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
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
                                type="submit"
                                disabled={isSubmitting}
                                onClick={() => {}}
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
                                SEND
                            </Button>
                        </InputWrapper>
                        <>
                            {reauth && (
                                <div>
                                    <div>
                                        For Security Purpose Sign in and try
                                        again
                                    </div>
                                    <Reauth type="email" />
                                </div>
                            )}
                        </>
                    </Form>
                )
            }
        </Formik>
    )
}
