import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import { Input } from '../address/addressform'
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
import { useUser } from 'reactfire'
import { updateEmail, updatePassword, deleteUser } from 'firebase/auth' // Firebase v9+

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
    const [changeEmail, setChangeEmail] = useState(false)
    const [changePassword, setChangePassword] = useState(false)
    const [deleteAccount, setDeleteAccount] = useState(false)
    return (
        <div>
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

interface ChangeMailProps {
    setShowModal: (showModal: boolean) => void
}
function ChangeEmail({ setShowModal }: ChangeMailProps) {
    //const user = firebase.auth().currentUser;
    const { data: user } = useUser()
    const [reauth, setReauth] = useState(false)
    const [success, setSuccess] = useState(false)
    return (
        <Formik
            initialValues={{ email: '' }}
            //Remember to validate with YUP
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
