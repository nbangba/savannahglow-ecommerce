import React from 'react'
import CardComponent from '../supportingui/card'
import { doc } from 'firebase/firestore'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { CardItem } from '../address/addresscard'
import Errorwrapper, { Loading } from '../errorwrapper'
import { leadingZeros } from '../../helperfunctions'
import { GatsbyImage } from 'gatsby-plugin-image'
import { idText } from 'typescript'
import styled from 'styled-components'
import { refund } from '../../helperfunctions/cloudfunctions'
import { generatePdfDocument } from './orders'
import { Button } from '../layout/navbar'

const moment = require('moment')

const OrderWrapper = styled.div`
    display: flex;
    justify-content: center;
`

export default function OrderComponent(props) {
    console.log(props)
    const firestore = useFirestore()
    const orderRef = doc(firestore, 'orders', props.id)
    const { status, data: order } = useFirestoreDocData(orderRef)
    console.log(order)
    if (order)
        return (
            <Errorwrapper>
                <OrderWrapper>
                    <CardComponent maxWidth="600px">
                        <CardItem>
                            {moment
                                .unix(order.orderCreated.seconds)
                                .calendar(null, {
                                    sameElse: 'DD/MM/YY [at] hh:mm a',
                                })}
                        </CardItem>
                        <CardItem>
                            <span style={{ fontWeight: 'bold' }}>
                                Order Id:{' '}
                            </span>
                            {leadingZeros(5, order.orderID)}
                        </CardItem>
                        {order.orderStatus == 'delivered' ? (
                            <>
                                <CardItem>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {' '}
                                        Order status
                                    </span>
                                    : {order.orderStatus}
                                </CardItem>
                                <CardItem>
                                    <span style={{ fontWeight: 'bold' }}>
                                        Delivered At
                                    </span>
                                    :{' '}
                                    {moment
                                        .unix(order.deliveryTime.seconds)
                                        .calendar(null, {
                                            sameElse: 'DD/MM/YY [at] hh:mm a',
                                        })}
                                </CardItem>
                                <CardItem>
                                    <span style={{ fontWeight: 'bold' }}>
                                        Deliver To
                                    </span>
                                    :
                                    <div>
                                        {order.order.orderAddress.firstname}{' '}
                                        {order.order.orderAddress.lastname}
                                    </div>
                                    <div>
                                        {order.order.orderAddress.location}
                                    </div>
                                    <div>{order.order.orderAddress.phone}</div>
                                </CardItem>
                                <CardItem>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {' '}
                                        Delivered By:
                                    </span>{' '}
                                    {order.dispatcher.label}
                                </CardItem>
                            </>
                        ) : (
                            <>
                                <CardItem>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {' '}
                                        Order status
                                    </span>
                                    : {order.orderStatus}
                                </CardItem>
                                <CardItem>
                                    <span style={{ fontWeight: 'bold' }}>
                                        Deliver To
                                    </span>
                                    :
                                    <div>
                                        {order.order.orderAddress.firstname}{' '}
                                        {order.order.orderAddress.lastname}
                                    </div>
                                    <div>
                                        {order.order.orderAddress.location}
                                    </div>
                                    <div>{order.order.orderAddress.phone}</div>
                                </CardItem>
                            </>
                        )}
                        {order.reasonsDeliveryFailed && (
                            <CardItem>
                                <div>
                                    {`${order.reasonsDeliveryFailed.length} failed attempt(s)`}
                                </div>
                                <ul>
                                    {order.reasonsDeliveryFailed.map(
                                        (reason) => (
                                            <li>{reason.reason}</li>
                                        )
                                    )}
                                </ul>
                            </CardItem>
                        )}
                        {order.order.items.map((item) => (
                            <CardItem>
                                <CardItem style={{ fontWeight: 'bold' }}>
                                    Savannah Glow
                                </CardItem>
                                <div style={{ display: 'flex' }}>
                                    <GatsbyImage
                                        style={{
                                            width: 100,
                                            objectFit: 'contain',
                                        }}
                                        image={
                                            item.images[0].localFile
                                                .childImageSharp.gatsbyImageData
                                        }
                                        alt=""
                                    />
                                    <CardItem>
                                        <CardItem>{item.name} </CardItem>
                                        {item.discount && item.discount > 0 ? (
                                            <>
                                                <CardItem>
                                                    <span>
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    'bold',
                                                            }}
                                                        >
                                                            <small>
                                                                Original
                                                            </small>{' '}
                                                            Price:{' '}
                                                        </span>
                                                        <span
                                                            style={{
                                                                textDecoration:
                                                                    'line-through',
                                                                color: 'gray',
                                                            }}
                                                        >
                                                            {'GHS ' +
                                                                item.price.toFixed(
                                                                    2
                                                                )}
                                                        </span>
                                                    </span>
                                                </CardItem>
                                                <CardItem>
                                                    <span>
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    'bold',
                                                            }}
                                                        >
                                                            <small>
                                                                Discounted
                                                            </small>{' '}
                                                            Price:{' '}
                                                        </span>
                                                        <span>
                                                            {'GHS ' +
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
                                                        style={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Price:
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
                                        )}

                                        <CardItem>
                                            <span>
                                                <span
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    Qty:{' '}
                                                </span>
                                                <span>{item.quantity}</span>
                                            </span>
                                        </CardItem>
                                        <CardItem>
                                            <span>
                                                <span
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    Sub Total:{' '}
                                                </span>
                                                <span
                                                    style={{
                                                        textDecoration:
                                                            'strike-through',
                                                    }}
                                                >
                                                    {'GHS ' +
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
                            </CardItem>
                        ))}
                        <CardItem>
                            <span style={{ fontWeight: 'bold' }}>Total</span>:
                            GHS {order.order.amount}
                        </CardItem>
                        <CardItem>
                            {order.orderStatus == 'received' && (
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
                                                order.receiptID
                                                    ? order.receiptID
                                                    : -1
                                            )}`
                                        )
                                    }
                                >
                                    Download Receipt
                                </Button>
                            )}
                        </CardItem>
                    </CardComponent>
                </OrderWrapper>
            </Errorwrapper>
        )
    else
        return (
            <Loading>
                <div className="lds-facebook">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </Loading>
        )
}
