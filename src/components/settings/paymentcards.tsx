import React, { useState, useEffect, lazy } from 'react'
import { Input } from '../address/addressform'
import { InputWrapper } from '../address/addressform'
import { Label } from '../address/addressform'
import { CSSTransition } from 'react-transition-group'
import ModalComponent from '../supportingui/modal'
import {
    doc,
    collection,
    query,
    where,
    deleteDoc,
    setDoc,
} from 'firebase/firestore'
import {
    useUser,
    useFirestoreCollectionData,
    useFirestoreDocData,
    useFirestore,
} from 'reactfire'
import Cards from 'react-credit-cards'
import { Card } from '../supportingui/card'
import { Remove } from '../address/addresscard'
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

export default function PaymentCards() {
    const db = useFirestore()
    const { data: user } = useUser()
    const cardsCollection = collection(db, 'cards')
    const cardsQuery = query(
        cardsCollection,
        where('owner', '==', user ? user.uid : '')
    )
    const { status, data: cards } = useFirestoreCollectionData(cardsQuery)
    const useFsRef = doc(db, 'users', user ? user.uid : '')
    const { data: userFs } = useFirestoreDocData(useFsRef)
    const [showModal, setShowModal] = useState(false)
    const [saveCard, setSaveCard] = useState(userFs.saveCard)
    console.log(saveCard)

    useEffect(() => {
        if (saveCard != userFs.saveCard)
            setDoc(useFsRef, { saveCard: saveCard }, { merge: true })
                .then(() => console.log('save cards', saveCard))
                .catch((e) => console.log(e))
    }, [saveCard, userFs])

    const deleteCard = (card: any) =>
        deleteDoc(doc(db, 'cards', card.NO_ID_FIELD))
            .then(() => console.log('Card deleted'))
            .catch((e) => console.log(e))

    function DeleteCardDialog({ card }: any) {
        return (
            <ModalComponent showModal={showModal} setShowModal={setShowModal}>
                <div>
                    <div>Are you sure you want to delete this card?</div>
                    <button onClick={() => setShowModal(false)}>No</button>
                    <button
                        onClick={() => {
                            deleteCard(card)
                            setShowModal(false)
                        }}
                    >
                        Yes
                    </button>
                </div>
            </ModalComponent>
        )
    }
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {cards &&
                cards.map((card) => (
                    <Card>
                        <Remove
                            style={{ zIndex: 100 }}
                            onClick={() => setShowModal(true)}
                        />
                        <DeleteCardDialog card={card} />
                        <Cards
                            cvc="***"
                            expiry={`${card.authorization.exp_month}/${card.authorization.exp_year}`}
                            name={
                                card.authorization.account_name
                                    ? card.authorization.account_name
                                    : 'CARD HOLDER'
                            }
                            number={`${card.authorization.bin}******${card.authorization.last4}`}
                        />
                    </Card>
                ))}
            <InputWrapper
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    flex: '1 1 100px',
                    justifyContent: 'space-between',
                    maxWidth: 200,
                    minWidth: 200,
                }}
            >
                <Label>Save cards</Label>
                <Switch>
                    <Input
                        onChange={() => {
                            setSaveCard((prev: boolean) => !prev)
                        }}
                        checked={saveCard}
                        type="checkbox"
                        name="firstname"
                        id="firstname"
                    />
                    <Slider></Slider>
                </Switch>
            </InputWrapper>
        </div>
    )
}
