import React, { useEffect } from 'react'
import styled, { css } from 'styled-components'
import 'react-phone-input-2/lib/style.css'

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 100 !important;
`

const ModalContent = styled.div`
    width: ${(props: { width?: string }) => props.width || '800px'};
    overflow-y: auto;
    min-height: 100px;
    max-height: 100vh;
    background-color: #ebddd2;
    border-radius: 5px;
    z-index: 200 !important;
    font-family: 'Montserrat', sans-serif;
    h3 {
        font-family: 'Montserrat', sans-serif;
        font-size: 24px;
        font-weight: 400;
        color: #35486f;
        width: 100%;
        text-align: center;
    }
    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey;

        border-radius: 5px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #d6b9a2;
        border-radius: 5px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #c3a893;
    }
`
const FormWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    h3 {
        margin: 10px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        width: 100%;
        font-size: 14px;
        font-weight: 500;
    }
`
interface ModalProps {
    showModal: boolean
    setShowModal?: (show: boolean) => void
    children: any
    width?: string
    title?: string
    style?: Object
}
export default function ModalComponent({
    showModal,
    setShowModal,
    children,
    width,
    title,
    style = {},
}: ModalProps) {
    useEffect(() => {
        if (showModal) document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [showModal])

    if (!showModal) return null

    return (
        <Modal
        /*onMouseLeave={()=>{if(type != 'form' && setShowModal) setShowModal(false)}}*/
        >
            <ModalContent style={style} width={width}>
                <FormWrapper>
                    <h3>{title ? title : ''}</h3>
                    {children}
                </FormWrapper>
            </ModalContent>
        </Modal>
    )
}
