import React, { useState, useEffect, lazy } from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import Errorwrapper from '../errorwrapper'
import loadable from '@loadable/component'
const PersonalInfo = loadable(() => import('./personalinfo'))
const Account = loadable(() => import('./account'))
const Addresses = loadable(() => import('./addresses'))
const Notifications = loadable(() => import('./notifications'))
const PaymentCards = loadable(() => import('./paymentcards'))

const Accordion = styled.div`
    background-color: #e5cfc1;
    font-family: 'Montserrat', sans-serif;
    color: #35486f;
    font-weight: bold;
    cursor: pointer;
    padding: 18px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    transition: 0.4s;
    box-sizing: border-box;
    &:hover {
        background-color: #dbb7a1;
    }
`

const AccordionButtonWrapper = styled.div`
    max-width: 900px;
    width: 100%;
    font-family: 'Montserrat', sans-serif;
    margin: auto;
    .accordion-enter {
        max-height: 0;
        opacity: 0;
    }

    .accordion-enter-active {
        max-height: 500px;
        opacity: 1;
        transition: max-height 1000ms, opacity 1000ms;
    }

    .accordion-exit {
        max-height: 500px;
    }

    .accordion-exit-active {
        max-height: 0;
        opacity: 0;
        transition: max-height 1000ms, opacity 1000ms;
    }
`

const SettingsWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`

interface AccordionButtonProps {
    activeTab: string
    setActiveTab: (active: string) => void
    name: string
    title: string
    children: JSX.Element | JSX.Element[]
    childComponent?: JSX.Element
    style?: any
}

export function AccordionButton({
    activeTab,
    setActiveTab,
    name,
    title,
    children,
    childComponent,
    style,
}: AccordionButtonProps) {
    const activate = () =>
        activeTab == name ? setActiveTab('') : setActiveTab(name)

    return (
        <AccordionButtonWrapper>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {childComponent}
                <Accordion onClick={activate} style={{ ...style }}>
                    {title}
                </Accordion>
            </div>
            <CSSTransition
                in={activeTab === name}
                timeout={1000}
                unmountOnExit
                classNames="accordion"
            >
                <div
                    style={{
                        maxWidth: 800,
                        margin: 'auto',
                        overflow: 'hidden',
                    }}
                >
                    {children}
                </div>
            </CSSTransition>
        </AccordionButtonWrapper>
    )
}
export default function Settings() {
    const [activeTab, setActiveTab] = useState('')
    return (
        <SettingsWrapper>
            {/*<AccordionButton
                name="personal info"
                title="Personal Info"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            >
                <Errorwrapper>
                    <PersonalInfo />
    </Errorwrapper>
            </AccordionButton>*/}
            <AccordionButton
                name="account"
                title="Account"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            >
                <Errorwrapper>
                    <Account />
                </Errorwrapper>
            </AccordionButton>
            <AccordionButton
                name="address"
                title="Address"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            >
                <Errorwrapper>
                    <Addresses wrap={true} />
                </Errorwrapper>
            </AccordionButton>
            <AccordionButton
                name="notifications"
                title="Notifications"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            >
                <Notifications />
            </AccordionButton>
            <AccordionButton
                name="cards"
                title="Cards"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            >
                <Errorwrapper>
                    <PaymentCards />
                </Errorwrapper>
            </AccordionButton>
        </SettingsWrapper>
    )
}
