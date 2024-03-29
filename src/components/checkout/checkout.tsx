import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '../supportingui/card'
import {
    useUser,
    useSigninCheck,
    useFirestoreDocData,
    useFirestore,
    useFirestoreCollectionData,
    SuspenseWithPerf,
    ObservableStatus,
} from 'reactfire'
import {
    collection,
    where,
    query,
    doc,
    orderBy,
    Firestore,
} from 'firebase/firestore'
import styled from 'styled-components'
import { CartItems } from '../cart/cart'
import { Button } from '../layout/navbar'
import momo from '../../images/non-svg/momo.jpg'
import paystack from '../../images/non-svg/paystack.png'
import Visa from '../../images/svgs/visa.svg'
import Master from '../../images/svgs/master.svg'
import ModalComponent from '../supportingui/modal'
import * as Yup from 'yup'
import AddressCard from '../address/addresscard'
import { Formik, Form, Field, ErrorMessage, validateYupSchema } from 'formik'
import { CardItem } from '../address/addresscard'
import { verifyPaystack } from '../../helperfunctions/cloudfunctions'
import Cards from 'react-credit-cards'
import { chargeCard, payOnDelivery } from '../../helperfunctions/cloudfunctions'
import { AddressInfoProps } from '../address/addressform'
import { VarietyProps } from '../product/product'
import 'react-credit-cards/es/styles-compiled.css'
import { SubTotalProps, CartProps } from '../cart/cart'
import Errorwrapper, { Loading } from '../errorwrapper'
import loadable from '@loadable/component'
import { navigate } from 'gatsby'
import { setServers } from 'dns'
const AddressForm = loadable(() => import('../address/addressform'))
const Addresses = loadable(() => import('../settings/addresses'))

const RadioButtonsContainer = styled.label`
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 18px;
    color: #35486f;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    height: fit-content;
    font-family: 'Montserrat', sans-serif;
    input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
    }

    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: #eee;
        border-radius: 50%;
    }

    &:hover input ~ .checkmark {
        background-color: #ccc;
    }

    input:checked ~ .checkmark {
        background-color: #2196f3;
    }

    .checkmark:after {
        content: '';
        position: absolute;
        display: none;
        top: 9px;
        left: 9px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
    }

    input:checked ~ .checkmark:after {
        display: block;
    }
`

const CheckoutWrapper = styled.div`
   display:flex;
   flex-wrap:wrap;
   justify-content:center;
   max-width:1200px;
   margin:auto;
   #checkout{
       width:100%;
   }
   .checkout-form{
       width:100%;
       max-width:fit-content;
       display:flex;
       flex-wrap:wrap;
       flex:1 0 300px;
   @media only screen and (max-width: 750px) {
    flex-wrap:wrap;
    flex:1 0 100%;
   }
  }
}
`

export default function Checkout({ location }: any) {
    const { status, data: user } = useUser()
    const db = useFirestore()
    const cartRef = doc(
        db,
        location && location.state && location.state.fromFeed
            ? 'buyNow'
            : 'carts',
        user ? user.uid : 'null'
    )
    const { data: cart } = useFirestoreDocData(
        cartRef
    ) as ObservableStatus<CartProps>
    const items: VarietyProps[] = cart && cart.items

    const cardsCollection = collection(db, 'cards')
    const cardsQuery = query(
        cardsCollection,
        where('uid', '==', user ? user.uid : 'null')
    )
    const { data: cards } = useFirestoreCollectionData(cardsQuery)
    const card = cards && cards[0] && cards[0].authorization
    console.log(card)

    const addressesCollection = collection(db, 'addresses')
    const addressesQuery = query(
        addressesCollection,
        where('isDefault', '==', true),
        where('uid', '==', user ? user.uid : 'null')
    )
    const { status: info, data: addresses } = useFirestoreCollectionData(
        addressesQuery
    ) as ObservableStatus<AddressInfoProps[]>
    const [selected, setSelected] = useState(addresses[0])
    const [transactionStatus, setTransactionStatus] = useState('Loading')
    const orderSchema = Yup.object().shape({
        orderAddress: Yup.object().required('An address is required'),
        payment: Yup.string().required('Select a payment option'),
    })
    const [showModal, setShowModal] = useState(false)

    if (items && items.length > 0)
        return (
            <CheckoutWrapper>
                <TransactStatusModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    transactionStatus={transactionStatus}
                ></TransactStatusModal>
                <div className="checkout-form">
                    <Formik
                        initialValues={{
                            orderAddress: selected,
                            payment: 'paystack',
                            paystackOptions: '',
                            amount: cart.discountedTotal
                                ? cart.discountedTotal
                                : cart.totalAmount,
                            items: [...items],
                            collection:
                                location &&
                                location.state &&
                                location.state.fromFeed
                                    ? 'buyNow'
                                    : 'carts',
                            isAnonymous: user ? user.isAnonymous : true,
                        }}
                        validationSchema={orderSchema}
                        onSubmit={(values: any, { setSubmitting }: any) => {
                            const thereIsQty =
                                window.localStorage.getItem('quantity')
                            console.log(thereIsQty)
                            setTimeout(() => {
                                console.log('verifying')
                                values.amount = cart.discountedTotal
                                    ? cart.discountedTotal
                                    : cart.totalAmount
                                values.items = [...items]
                                values.collection =
                                    location &&
                                    location.state &&
                                    location.state.fromFeed
                                        ? 'buyNow'
                                        : 'carts'
                                values.orderAddress = selected
                                values.isAnonymous = user
                                    ? user.isAnonymous
                                    : true
                                console.log(JSON.stringify(values, null, 2))
                                if (values.paystackOptions == 'defaultCard') {
                                    chargeCard(
                                        { ...values },
                                        cards[0].NO_ID_FIELD
                                    ).then((result) => {
                                        console.log(
                                            'charge card result',
                                            result
                                        )
                                    })
                                } else if (values.payment == 'paystack') {
                                    payWithPaystack(
                                        { ...values },
                                        setTransactionStatus
                                    )
                                    setShowModal(true)
                                } else {
                                    setShowModal(true)
                                    payOnDelivery({ ...values }).then(
                                        (result: any) => {
                                            console.log(
                                                'charge card result',
                                                result
                                            )
                                            if (
                                                result &&
                                                result.data.status ===
                                                    'successful'
                                            ) {
                                                setShowModal(false)
                                                navigate(
                                                    `/user/orders/order/${result.data.firebasedata}`
                                                )
                                            } else setSubmitting(false)
                                        }
                                    )
                                }
                            }, 400)
                        }}
                    >
                        {({
                            setFieldValue,
                            values,
                            isSubmitting,
                            handleSubmit,
                        }: any) => (
                            <Form id="checkout">
                                <Errorwrapper>
                                    <UserAddress
                                        selected={selected}
                                        setSelected={setSelected}
                                        addresses={addresses}
                                        setFieldValue={setFieldValue}
                                    />
                                    <ErrorMessage
                                        name="orderAddress"
                                        component="div"
                                    />
                                </Errorwrapper>
                                <Errorwrapper>
                                    <PaymentSegment
                                        card={card}
                                        values={values}
                                        db={db}
                                        user={user}
                                    />
                                    <ErrorMessage
                                        name="payment"
                                        component="div"
                                    />
                                </Errorwrapper>
                                <Errorwrapper>
                                    <CartItems location={location} />
                                </Errorwrapper>
                                <Subtotal
                                    cart={cart}
                                    isSubmitting={isSubmitting}
                                    handleSubmit={handleSubmit}
                                />
                            </Form>
                        )}
                    </Formik>
                </div>
            </CheckoutWrapper>
        )
    else
        return (
            <CheckoutWrapper>
                <div>No items to checkout.</div>
            </CheckoutWrapper>
        )
}

function UserAddress({
    selected,
    setSelected,
    addresses,
    setFieldValue,
}: {
    selected: AddressInfoProps
    setSelected: (selected: AddressInfoProps) => void
    setFieldValue: (field: string, value: AddressInfoProps) => void
    addresses: AddressInfoProps[]
}) {
    const [showModal, setShowModal] = useState(false)
    const [changeAddress, setchangeAddress] = useState(false)
    const { status, data: signInCheckResult } = useSigninCheck()

    useEffect(() => {
        if (addresses.length <= 1) {
            setSelected(addresses[0])
        }
    }, [addresses])

    useEffect(() => {
        setFieldValue('orderAddress', selected)
    }, [selected])

    return (
        <>
            {signInCheckResult && signInCheckResult.signedIn && selected ? (
                <>
                    {
                        <AddressCard
                            maxWidth="900px"
                            minWidth="200px"
                            addressInfo={selected}
                            style={{ margin: '10px 0px' }}
                        >
                            <CardItem>
                                <Button
                                    type="button"
                                    secondary
                                    onClick={() => setchangeAddress(true)}
                                    onMouseOver={() => Addresses.preload()}
                                >
                                    Change Address
                                </Button>
                            </CardItem>
                        </AddressCard>
                    }
                    <ModalComponent showModal={changeAddress}>
                        <Addresses
                            wrap
                            selected={selected}
                            setSelected={setSelected}
                            selectable
                        />
                        <Button
                            type="button"
                            secondary
                            onClick={() => setchangeAddress(false)}
                        >
                            CLOSE
                        </Button>
                    </ModalComponent>
                </>
            ) : (
                <>
                    <Button
                        type="button"
                        secondary
                        onClick={() => setShowModal(true)}
                        onMouseOver={() => AddressForm.preload()}
                    >
                        Add Address
                    </Button>
                    <ModalComponent
                        showModal={showModal}
                        setShowModal={setShowModal}
                    >
                        <AddressForm
                            setShowModal={setShowModal}
                            addressInfo={selected}
                        />
                    </ModalComponent>
                </>
            )}
        </>
    )
}

interface PaymentSegmentProps {
    card: any
    values: InfoProps
    db: Firestore
    user: any
}
function PaymentSegment({ card, values, db, user }: PaymentSegmentProps) {
    const useFsRef = doc(db, 'users', user.uid)
    const { data: userFs } = useFirestoreDocData(useFsRef)

    return (
        <Card maxWidth="400px" style={{ margin: '10px 0px', maxWidth: 900 }}>
            <div role="group" aria-labelledby="my-radio-group">
                <RadioButtonsContainer>
                    <div>
                        <img src={paystack} />
                        <img src={momo} />
                        <Visa />
                        <Master />
                    </div>
                    <Field type="radio" name="payment" value="paystack" />
                    <span className="checkmark"></span>
                    {card &&
                        userFs &&
                        userFs.saveCard &&
                        values.payment == 'paystack' && (
                            <>
                                <RadioButtonsContainer>
                                    {' '}
                                    Mobile Money or New Card
                                    <Field
                                        type="radio"
                                        name="paystackOptions"
                                        value="momo"
                                    />
                                    <span className="checkmark"></span>
                                </RadioButtonsContainer>
                                <span className="checkmark"></span>
                                <RadioButtonsContainer>
                                    <Cards
                                        cvc="***"
                                        expiry={`${card.exp_month}/${card.exp_year}`}
                                        name={
                                            card.account_name
                                                ? card.account_name
                                                : 'CARD HOLDER'
                                        }
                                        number={`${card.bin}******${card.last4}`}
                                    />
                                    <Field
                                        type="radio"
                                        name="paystackOptions"
                                        value="defaultCard"
                                    />
                                    <span className="checkmark"></span>
                                </RadioButtonsContainer>
                            </>
                        )}
                </RadioButtonsContainer>
                <RadioButtonsContainer>
                    {' '}
                    Pay on delivery
                    <Field type="radio" name="payment" value="POD" />
                    <span className="checkmark"></span>
                </RadioButtonsContainer>
            </div>
        </Card>
    )
}

function Subtotal({ cart, isSubmitting, handleSubmit }: SubTotalProps) {
    return (
        <Card
            style={{
                alignContent: 'flex-start',
                justifyContent: 'center',
                textAlign: 'center',
                maxHeight: 150,
                fontFamily: `'Montserrat',sans-serif`,
                margin: 'auto',
            }}
        >
            <div style={{ width: '100%', padding: 20 }}>
                {`Subtotal(${cart.numberOfItems} items): GHS ${
                    cart.discountedTotal
                        ? cart.discountedTotal
                        : cart.totalAmount
                }`}
            </div>
            <Button
                primary
                type="submit"
                disabled={isSubmitting}
                onClick={() => {
                    handleSubmit
                }}
                form="checkout"
                style={{ minWidth: 'fit-content', width: 250 }}
            >
                {isSubmitting ? 'Please Wait...' : 'Place Order'}
            </Button>
        </Card>
    )
}

function TransactStatusModal({
    showModal,
    setShowModal,
    transactionStatus,
}: any) {
    const [status, setStatus] = useState(transactionStatus)
    useEffect(() => {
        setStatus(transactionStatus)
    }, [transactionStatus])
    setTimeout(() => {
        setStatus('something went wrong')
    }, 60000)

    return (
        <ModalComponent showModal={showModal} setShowModal={setShowModal}>
            {status == 'Loading' ? (
                <div>
                    <div>Finishing up</div>
                    <Loading>
                        <div className="lds-facebook">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </Loading>
                </div>
            ) : status == 'complete' ? (
                <div>
                    <div>Transaction Complete</div>
                    <Button onClick={() => setShowModal(false)} primary>
                        Ok
                    </Button>
                </div>
            ) : (
                <div>
                    <div>Something went wrong!</div>
                    <Button onClick={() => setShowModal(false)} primary>
                        Ok
                    </Button>
                </div>
            )}
        </ModalComponent>
    )
}
export interface InfoProps {
    amount: number
    orderAddress: AddressInfoProps
    items: VarietyProps[]
    collection: string
    isAnonymous: boolean
    payment: string
    paystackOptions: string
}

function payWithPaystack(info: InfoProps, setTransactionStatus: any) {
    var handler = window.PaystackPop.setup({
        key: `pk_test_64cadcb7dfa0a05f73626432160213f40c80c77c`, // Replace with your public key
        email: info.orderAddress.email,
        amount: info.amount * 100, // the amount value is multiplied by 100 to convert to the lowest currency unit
        currency: 'GHS', // Use GHS for Ghana Cedis or USD for US Dollars
        callback: function (response: any) {
            //this happens after the payment is completed successfully
            var reference = response.reference
            console.log(response)
            verifyPaystack(info, response)
                .then((result: any) => {
                    if (result.data.status == 'complete') {
                        setTransactionStatus('complete')
                    } else setTransactionStatus('Something went wrong!')
                })
                .then(() => navigate(`/user/orders/order/${reference}`))
            alert('Payment complete! Reference: ' + reference)
            navigate
            // Make an AJAX call to your server with the reference to verify the transaction
        },
        onClose: function () {
            alert('Transaction was not completed, window closed.')
            setTransactionStatus('Something went wrong!')
        },
    })
    handler.openIframe()
}
