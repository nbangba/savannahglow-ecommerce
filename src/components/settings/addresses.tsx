import React, { useState, useEffect, lazy } from 'react'
import { AddressInfoProps, Input } from '../address/addressform'
import { Button } from '../layout/navbar'
import styled from 'styled-components'
import ModalComponent from '../supportingui/modal'
import { collection, query, orderBy, where } from 'firebase/firestore'
import {
    useUser,
    useFirestoreCollectionData,
    useFirestore,
    ObservableStatus,
} from 'reactfire'
import { AddressCardOptions } from '../address/addresscard'
import Errorwrapper from '../errorwrapper'
import loadable from '@loadable/component'
const AddressForm = loadable(() => import('../address/addressform'))
const AddressCard = loadable(() => import('../address/addresscard'))

interface AddressesProps {
    wrap: boolean
    selectable?: boolean
    selected?: AddressInfoProps
    setSelected?: (selected: AddressInfoProps) => void
}

const CardWrapper = styled.div`
    display: flex;
    width: 100%;
    flex: 1 0 200px;
    flex-wrap: wrap;
    overflow-x: auto;
`
export default function Addresses({
    wrap,
    selectable,
    selected,
    setSelected,
}: AddressesProps) {
    const { data: user } = useUser()
    const firestore = useFirestore()
    const addressesCollection = collection(firestore, 'addresses')
    const addressesQuery = query(
        addressesCollection,
        orderBy('dateCreated', 'desc'),
        where('uid', '==', user ? user.uid : '')
    )
    const getDefault = (addresses: AddressInfoProps[]) =>
        addresses.filter((address) => address.isDefault)
    const { status, data: addresses } = useFirestoreCollectionData(
        addressesQuery
    ) as ObservableStatus<AddressInfoProps[]>
    const [defaultAddress, setDefaultAddress] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const currentDefault = getDefault(addresses)
        if (currentDefault.length == 1 && currentDefault[0].NO_ID_FIELD)
            setDefaultAddress(currentDefault[0].NO_ID_FIELD)
    }, [addresses])

    return (
        <div>
            <Button
                type="button"
                secondary
                onMouseOver={() => AddressForm.preload()}
                onClick={() => setShowModal(true)}
            >
                Add Address
            </Button>
            <ModalComponent showModal={showModal} setShowModal={setShowModal}>
                <Errorwrapper>
                    <AddressForm setShowModal={setShowModal} />
                </Errorwrapper>
            </ModalComponent>
            <CardWrapper>
                {addresses &&
                    addresses.map((addressInfo) => {
                        return (
                            <Errorwrapper>
                                <AddressCard
                                    selectable={selectable}
                                    selected={
                                        selectable &&
                                        (selected && selected.NO_ID_FIELD) ==
                                            addressInfo.NO_ID_FIELD
                                    }
                                    setSelected={setSelected}
                                    addressInfo={addressInfo}
                                    key={addressInfo.NO_ID_FIELD}
                                >
                                    <AddressCardOptions
                                        defaultAddress={defaultAddress}
                                        setDefaultAddress={setDefaultAddress}
                                        addressInfo={addressInfo}
                                    />
                                </AddressCard>
                            </Errorwrapper>
                        )
                    })}
            </CardWrapper>
        </div>
    )
}
