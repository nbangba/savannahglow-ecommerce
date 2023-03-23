import React, { useState, useEffect } from 'react'
import { usePopper } from 'react-popper'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'

export const MenuContent = styled.ul`
    display: flex;
    max-width: 190px;
    flex-wrap: wrap;
    text-align: start;
    justify-content: center;
    padding: 0;
    overflow: hidden;
`
export const MenuContentList = styled.li`
    width: 100%;
    min-width: 100%;
    display: block;
    flex: 33% 1 1;
    font-family: 'Montserrat', sans-serif;
    color: #35486f;
    background-color: ${(props: {
        bg?: string
        padding?: string
        children: any
        key?: number
    }) => props.bg || ''};
    margin: 5px;
    font-size: 18px;
    text-align: left;
    font-weight: 500;

    & a {
        box-sizing: border-box;
        width: fit-content;
        min-width: 100%;
        display: inline-block;
        padding: ${(props) => props.padding || '5px'};
        color: ${(props) => props.color || 'black'};
        text-decoration: none;
        &:hover {
            text-decoration: none;
            font-weight: bold;
        }
    }
`
interface PopperProps {
    children: (
        setReferenceElement: React.Dispatch<React.SetStateAction<null>>
    ) => void
    popperContentUI: JSX.Element | JSX.Element[]
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}
const Popper = ({ children, popperContentUI, open, setOpen }: PopperProps) => {
    const [referenceElement, setReferenceElement] = useState(null)
    const [popperElement, setPopperElement] = useState<any>()
    const [arrowElement, setArrowElement] = useState<any>(null)
    const { styles, attributes, update } = usePopper(
        referenceElement,
        popperElement,
        {
            modifiers: [
                { name: 'arrow', options: { element: arrowElement } },
                { name: 'offset', options: { offset: [-50, -10] } },
            ],
        }
    )

    //const [open, setOpen] = useState(false)

    useEffect(() => {
        if (open && update) update()
    }, [open])

    // used to close menu on click outside. replaced with tab index and onblur
    const handleClickOutside = (e: any) => {
        if (open) {
            const tooltip =
                document.getElementsByClassName('tooltip-enter-done')[0]
            console.log(e.target)
            if (tooltip && !tooltip.contains(e.target)) {
                setOpen(false)
            }
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [open])

    const tooltip = {
        minWidth: 'fit-content',
        backgroundColor: '#EBDDD2',
        fontWeight: 'normal',
        padding: ' 4px 8px',
        fontSize: '18px',
        borderRadius: '4px',
        marginTop: '10px',
        boxShadow: '2px 2px 20px 5px rgba(0, 0, 0, 0.2)',
    }

    const admin = [
        { displayName: 'User Order', link: '/user/admin/orders' },
        { displayName: 'Users', link: '/user/admin/users' },
    ]
    return (
        <>
            {children(setReferenceElement)}
            <CSSTransition
                in={open}
                timeout={200}
                unmountOnExit
                classNames="tooltip"
            >
                <div
                    style={{ ...styles.popper, ...tooltip }}
                    ref={setPopperElement}
                    {...attributes.popper}
                    //onMouseEnter={() => setOpen(true)}
                >
                    {popperContentUI}
                    <div ref={setArrowElement} style={styles.arrow} />
                </div>
            </CSSTransition>
        </>
    )
}

export default Popper
