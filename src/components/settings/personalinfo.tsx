import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage, validateYupSchema } from 'formik'
import { Input } from '../address/addressform'
import { InputWrapper } from '../address/addressform'
import PhoneInput from 'react-phone-input-2'
import { Label } from '../address/addressform'
import { Button } from '../layout/navbar'
import { reactTextInput } from '../address/addressform'
import { useUser } from 'reactfire'

const dropDownStyle = {
    border: '1px solid #556585',
    backgroudColor: '#f4ece6',
}

export default function PersonalInfo() {
    const { data: user } = useUser()

    return (
        <Formik
            initialValues={{
                displayName: (user && user.displayName) || '',
                email: (user && user.email) || '',
                phone: (user && user.phoneNumber) || '',
            }}
            //Remember to add yup for  validation check.
            onSubmit={(values: any, { setSubmitting }: any) => {
                setTimeout(() => {
                    console.log(JSON.stringify(values, null, 2))
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
                    </InputWrapper>
                    <InputWrapper>
                        <Label>Email</Label>
                        <Input
                            onChange={handleChange}
                            value={values.email}
                            type="email"
                            name="email"
                            id="email"
                        />
                        <ErrorMessage name="email" component="div" />
                    </InputWrapper>
                    <InputWrapper>
                        <Label>Phone Number</Label>
                        <PhoneInput
                            onChange={handleChange}
                            value={values.phone}
                            dropdownStyle={{ ...dropDownStyle }}
                            inputStyle={{ ...reactTextInput }}
                        />
                    </InputWrapper>

                    <InputWrapper
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <Button
                            secondary
                            type="button"
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
