import React, { useState, lazy } from 'react'
import Card from '../supportingui/card'
import styled from 'styled-components'
import RemoveIcon from '../../images/svgs/remove.svg'
import Edit from '../../images/svgs/edit.svg'
import { Button } from '../layout/navbar'
import ModalComponent from '../supportingui/modal'
import { AddressInfoProps } from './addressform'
import { doc, deleteDoc, getFirestore, setDoc } from 'firebase/firestore'
import { useFirebaseApp } from 'reactfire'
import loadable from '@loadable/component'
const AddressForm = loadable(() => import('./addressform'))

export const CardItem = styled.div`
    display: flex;
    width: 100%;
    padding: 2px;
    margin: 2px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 400;
    color: #35486f;
    overflow: hidden;
    flex-wrap: wrap;
`

export const Remove = styled(RemoveIcon)`
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    fill: #474e52;
    cursor: pointer;
    &:hover {
        fill: black;
    }
`
interface AddressCardProps {
    children: JSX.Element
    selected?: boolean
    setSelected?: (selected: AddressInfoProps) => void
    selectable?: boolean
    addressInfo: AddressInfoProps
    maxWidth?: string
    minWidth?: string
    style?: React.CSSProperties
}

export default function AddressCard({
    addressInfo,
    children,
    selected,
    setSelected,
    selectable,
    maxWidth,
    style,
}: AddressCardProps) {
    const {
        firstname = '',
        lastname = '',
        email = '',
        phone = '',
        location = '',
        street = '',
        city = '',
        state = '',
        country = '',
    } = addressInfo

    return (
        <Card
            selected={selected}
            maxWidth={maxWidth}
            selectable={selectable}
            addressInfo={addressInfo}
            style={style}
            setSelected={setSelected}
        >
            <CardItem>
                {firstname} {lastname}
            </CardItem>
            <CardItem>{email}</CardItem>
            <CardItem>{phone}</CardItem>
            <CardItem>{location}</CardItem>
            {children}
        </Card>
    )
}

interface AddressCardOptionsProps {
    setDefaultAddress: (deafaultAddress: string | null) => void
    defaultAddress: string | null
    addressInfo: AddressInfoProps
}

export function AddressCardOptions({
    setDefaultAddress,
    defaultAddress,
    addressInfo,
}: AddressCardOptionsProps) {
    const [showDeletDialog, setShowDeleteDialog] = useState(false)
    const [editAddress, setEditAddress] = useState(false)

    const isDefault = addressInfo.isDefault

    console.log(defaultAddress)

    const db = getFirestore(useFirebaseApp())
    const deleteItem = () =>
        deleteDoc(
            doc(
                db,
                'addresses',
                addressInfo.NO_ID_FIELD ? addressInfo.NO_ID_FIELD : ''
            )
        )
            .then(() => console.log('Address  deleted'))
            .catch((e) => console.log(e))

    const addressRef = doc(
        db,
        'addresses',
        addressInfo.NO_ID_FIELD ? addressInfo.NO_ID_FIELD : ''
    )

    const setAsDefault = () => {
        if (defaultAddress) {
            const defaultAddressRef = doc(db, 'addresses', defaultAddress)
            setDoc(defaultAddressRef, { isDefault: false }, { merge: true })
                .then(() => setDefaultAddress(null))
                .then(() =>
                    setDoc(addressRef, { isDefault: true }, { merge: true })
                        .then(() =>
                            console.log(addressInfo.NO_ID_FIELD, 'now default')
                        )
                        .catch((e) => console.log(e))
                )
        } else {
            setDoc(addressRef, { isDefault: true }, { merge: true })
                .then(() => console.log(addressInfo.NO_ID_FIELD, 'now default'))
                .catch((e) => console.log(e))
        }
    }
    return (
        <>
            <Remove onClick={() => setShowDeleteDialog(true)} />
            <CardItem>
                <Button
                    type="button"
                    secondary
                    onClick={() => setEditAddress(true)}
                    onMouseOver={() => AddressForm.preload()}
                >
                    <Edit fill="#474E52" style={{ width: 20, height: 20 }} />
                    edit
                </Button>
                {isDefault ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        default
                    </div>
                ) : (
                    <Button type="button" secondary onClick={setAsDefault}>
                        set as default
                    </Button>
                )}
            </CardItem>
            <ModalComponent showModal={editAddress}>
                <AddressForm
                    setShowModal={setEditAddress}
                    addressInfo={addressInfo}
                />
            </ModalComponent>
            <DeleteDialog
                setShowDialog={setShowDeleteDialog}
                deleteItem={deleteItem}
                showModal={showDeletDialog}
            />
        </>
    )
}

interface DeleteDialogProps {
    setShowDialog: (showDialog: boolean) => void
    deleteItem: () => void
    showModal: boolean
    title?: string
}

interface DeleteDialogWithIndex {
    setShowDialog: (showDialog: boolean) => void
    deleteItem: (index: number) => void
    showModal: boolean
    title?: string
    index: number
}

type DeleteProps = DeleteDialogProps | DeleteDialogWithIndex
export function DeleteDialog({
    setShowDialog,
    deleteItem,
    showModal,
    title,
}: DeleteDialogProps) {
    return (
        <ModalComponent showModal={showModal}>
            <div>
                <div>{title}</div>
                <Button
                    type="button"
                    primary
                    onClick={() => {
                        deleteItem()
                        setShowDialog(false)
                    }}
                >
                    YES
                </Button>
                <Button
                    type="button"
                    secondary
                    onClick={() => setShowDialog(false)}
                >
                    NO
                </Button>
            </div>
        </ModalComponent>
    )
}
export function DeleteCartItem({
    setShowDialog,
    deleteItem,
    showModal,
    title,
    index,
}: DeleteDialogWithIndex) {
    return (
        <ModalComponent showModal={showModal}>
            <div>
                <div>{title}</div>
                <Button
                    type="button"
                    primary
                    onClick={() => {
                        deleteItem(index)
                        setShowDialog(false)
                    }}
                >
                    YES
                </Button>
                <Button
                    type="button"
                    secondary
                    onClick={() => setShowDialog(false)}
                >
                    NO
                </Button>
            </div>
        </ModalComponent>
    )
}
