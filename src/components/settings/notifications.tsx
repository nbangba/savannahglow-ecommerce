import React from 'react'
import { Formik, Form } from 'formik'
import { Input } from '../address/addressform'
import { InputWrapper } from '../address/addressform'
import { Label } from '../address/addressform'
import { Button } from '../layout/navbar'
import styled from 'styled-components'

const Switch = styled.label`
    position: relative;
    display: inline-block;
    width: 45px;
    height: 25.5px;

    input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    input:checked + span {
        background-color: #2659bf;
    }

    input:checked + span:before {
        transform: translateX(19.5px);
    }
`
const Slider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #7b7c7c;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 25.5px;

    &:before {
        position: absolute;
        content: '';
        height: 19.5px;
        width: 19.5px;
        left: 3px;
        bottom: 3px;
        border-radius: 50%;
        background-color: #f4ece6;
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }
`
export default function Notifications() {
    return (
        <Formik
            initialValues={{
                newsletter: 'newsletter',
                notifications: 'notifications',
            }}
            //add functionality
            onSubmit={(values: any, { setSubmitting }: any) => {
                setTimeout(() => {
                    console.log(JSON.stringify(values, null, 2))
                    setSubmitting(false)
                }, 400)
            }}
        >
            {({ isSubmitting, setFieldValue, handleChange, values }: any) => (
                <Form style={{ maxWidth: '500px' }}>
                    <InputWrapper
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: '100%',
                            flex: '1 1 100px',
                            justifyContent: 'space-between',
                            minWidth: 200,
                        }}
                    >
                        <Label>Subscribe to newsletters</Label>
                        <Switch>
                            <Input
                                onChange={handleChange}
                                value={values.newsletter}
                                type="checkbox"
                                name="firstname"
                                id="firstname"
                            />
                            <Slider></Slider>
                        </Switch>
                    </InputWrapper>
                    <InputWrapper
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: '100%',
                            flex: '1 1 100px',
                            justifyContent: 'space-between',
                            minWidth: 200,
                        }}
                    >
                        <Label>Recieve Notifications</Label>
                        <Switch>
                            <Input
                                onChange={handleChange}
                                value={values.notifications}
                                type="checkbox"
                                name="firstname"
                                id="firstname"
                            />
                            <Slider></Slider>
                        </Switch>
                    </InputWrapper>

                    <InputWrapper
                        wide
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
