import React, { useState } from 'react'
import CardComponent from '../supportingui/card'
import { collection, query, orderBy, where, limit } from 'firebase/firestore'
import {
    useUser,
    useFirestoreCollectionData,
    useFirestore,
    ObservableStatus,
} from 'reactfire'
import { CardItem } from '../address/addresscard'
import Errorwrapper from '../errorwrapper'
import { leadingZeros } from '../../helperfunctions'
import { calculateSubTotal } from '../../helperfunctions'
import { Button } from '../layout/navbar'
import { refund } from '../../helperfunctions/cloudfunctions'
import styled from 'styled-components'
import { pdf } from '@react-pdf/renderer'
import PDFDoc from '../receiptpdf'
import { saveAs } from 'file-saver'
import {
    LoadMore,
    OrderInfoProps,
    OrderInfoWithReceiptOrInvoice,
} from '../admin/adminCustomerOrders'
import { Link } from 'gatsby'
import { User } from 'firebase/auth'
import { GatsbyImage } from 'gatsby-plugin-image'

const moment = require('moment')

const OrderWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`

export const TextInfo = styled.div`
    font-family: 'Montserrat', sans-serif;
    display: flex;
    align-content: center;
    justify-content: center;
`

export default function Orders() {
    const { data: user } = useUser()
    if (user)
        return (
            <Errorwrapper>
                <OrdersComponent user={user} />
            </Errorwrapper>
        )

    return <TextInfo>No user</TextInfo>
}

interface OrdersComponentProps {
    user: User
}

function OrdersComponent({ user }: OrdersComponentProps) {
    const firestore = useFirestore()
    //const { status, data: signInCheckResult } = useSigninCheck()
    const ORDERS_PER_PAGE = 12
    const [page, setPage] = useState(1)
    const ordersCollection = collection(firestore, 'orders')
    const ordersQuery =
        user &&
        query(
            ordersCollection,
            where('user', '==', user.uid),
            orderBy('orderCreated', 'desc'),
            limit(page * ORDERS_PER_PAGE)
        )
    const { status, data: orders } = useFirestoreCollectionData(
        ordersQuery
    ) as ObservableStatus<OrderInfoWithReceiptOrInvoice[]>
    console.log('orders', orders)
    if (orders.length > 0)
        return (
            <OrderWrapper>
                {orders.map((order: OrderInfoWithReceiptOrInvoice) => (
                    <OrderCard order={order} role="owner" />
                ))}
                <LoadMore
                    setPage={setPage}
                    ORDERS_PER_PAGE={ORDERS_PER_PAGE}
                    numberOfItems={orders.length}
                />
            </OrderWrapper>
        )
    else return <TextInfo> nothing found </TextInfo>
}

interface OrderCardProps {
    order: OrderInfoWithReceiptOrInvoice
    role: string | object | null
    children?: JSX.Element | JSX.Element[]
}

export function OrderCard({ order, role = null, children }: OrderCardProps) {
    return (
        <CardComponent maxWidth="400px" style={{ height: 'fit-content' }}>
            <CardItem>
                {moment
                    .unix(order.orderCreated.seconds)
                    .calendar(null, { sameElse: 'DD/MM/YY [at] hh:mm a' })}
            </CardItem>
            <CardItem>
                <span style={{ fontWeight: 'bold' }}>Order Id: </span>
                {leadingZeros(5, order.orderID)}
            </CardItem>
            <CardItem>
                <span style={{ fontWeight: 'bold' }}> Order status</span>:{' '}
                {order.orderStatus}
            </CardItem>
            <CardItem>
                <span style={{ fontWeight: 'bold' }}>Deliver To</span>:
                <div>
                    {order.order.orderAddress.firstname}{' '}
                    {order.order.orderAddress.lastname}
                </div>
                {order.order.orderAddress.loc ? (
                    <div>
                        <a
                            style={{ textDecoration: 'none' }}
                            target="_blank"
                            href={`https://www.google.com/maps/search/?api=1&query=${order.order.orderAddress.loc.lat},${order.order.orderAddress.loc.lng}`}
                        >
                            {order.order.orderAddress.location}
                        </a>
                    </div>
                ) : (
                    <div>{order.order.orderAddress.location}</div>
                )}
                <div>{order.order.orderAddress.phone}</div>
            </CardItem>
            <>
                {order.order.items.slice(0, 1).map((item) => (
                    <CardItem>
                        <CardItem style={{ fontWeight: 'bold' }}>
                            {item.productName}
                        </CardItem>
                        <div style={{ display: 'flex' }}>
                            <GatsbyImage
                                style={{ width: 100, objectFit: 'contain' }}
                                image={
                                    item.images[0].localFile.childImageSharp
                                        .gatsbyImageData
                                }
                                alt=""
                            />
                            <CardItem>
                                <CardItem>{item.name} </CardItem>
                                {item.discount ? (
                                    <>
                                        <CardItem>
                                            <span>
                                                <span
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    <small>Original</small>{' '}
                                                    Price:{' '}
                                                </span>
                                                <span
                                                    style={{
                                                        textDecoration:
                                                            'line-through',
                                                        color: 'grey',
                                                    }}
                                                >{` GHS ${item.price.toFixed(
                                                    2
                                                )}`}</span>
                                            </span>
                                        </CardItem>
                                        <CardItem>
                                            <span>
                                                <span
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    <small>Discounted</small>{' '}
                                                    Price:{' '}
                                                </span>
                                                <span>
                                                    {' GHS ' +
                                                        (
                                                            item.price -
                                                            item.discount
                                                        ).toFixed(2)}
                                                </span>
                                            </span>
                                        </CardItem>
                                    </>
                                ) : (
                                    <CardItem>
                                        <span>
                                            <span
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                Price:
                                            </span>
                                            <span
                                                style={{
                                                    textDecoration:
                                                        'strike-through',
                                                }}
                                            >
                                                {' GHS ' +
                                                    (
                                                        item.price -
                                                        item.discount
                                                    ).toFixed(2)}
                                            </span>
                                        </span>
                                    </CardItem>
                                )}

                                <CardItem>
                                    <span>
                                        <span style={{ fontWeight: 'bold' }}>
                                            Qty:{' '}
                                        </span>
                                        <span>{item.quantity}</span>
                                    </span>
                                </CardItem>
                                <CardItem>
                                    <span>
                                        <span style={{ fontWeight: 'bold' }}>
                                            Sub Total:
                                        </span>
                                        <span
                                            style={{
                                                textDecoration:
                                                    'strike-through',
                                            }}
                                        >
                                            {' GHS ' +
                                                (
                                                    (item.price -
                                                        item.discount) *
                                                    item.quantity
                                                ).toFixed(2)}
                                        </span>
                                    </span>
                                </CardItem>
                            </CardItem>
                        </div>
                        {order.order.items.length > 1 && (
                            <CardItem>{`${
                                order.order.items.length - 1
                            } item(s) not shown`}</CardItem>
                        )}
                    </CardItem>
                ))}
            </>
            <CardItem>
                <span style={{ fontWeight: 'bold' }}>Total</span>: GHS{' '}
                {order.order.amount
                    ? order.order.amount
                    : calculateSubTotal(order.order.items)}
            </CardItem>
            <CardItem>
                {order.orderStatus == 'received' && role != 'dispatch' && (
                    <Button secondary onClick={() => refund(order)}>
                        Cancel order
                    </Button>
                )}
                {order.orderStatus != 'cancelled' && (
                    <Button
                        onClick={() =>
                            generatePdfDocument(
                                order,
                                `sg-receipt-${leadingZeros(
                                    5,
                                    order.receiptID ? order.receiptID : -1
                                )}`
                            )
                        }
                    >
                        Download Receipt
                    </Button>
                )}
                <Link to={`/user/orders/order/${order.NO_ID_FIELD}`}>
                    <Button
                        secondary
                        onClick={() => {
                            return
                        }}
                    >
                        See More
                    </Button>
                </Link>
                {children && children}
            </CardItem>
        </CardComponent>
    )
}

export const generatePdfDocument = async (
    order: OrderInfoWithReceiptOrInvoice,
    fileName: string
) => {
    const blob = await pdf(<PDFDoc order={order} />).toBlob()
    saveAs(blob, fileName)
}
