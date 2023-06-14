import React, { useEffect, useState } from 'react'
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFViewer,
    Font,
} from '@react-pdf/renderer'
import { leadingZeros } from '../helperfunctions'
import Regular from '../fonts/Montserrat/Montserrat-Regular.ttf'
import Bold from '../fonts/Montserrat/Montserrat-Bold.ttf'
import { calculateDiscountedSubTotal } from '../helperfunctions'
import { OrderInfoWithReceiptOrInvoice } from './admin/adminCustomerOrders'
const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        overflow: 'hidden',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 18,
        margin: 12,
        fontFamily: 'Oswald',
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: 'left',
        fontFamily: 'Montserrat',
        fontWeight: 'normal',
        width: 80,
        maxWidth: 100,
    },
    headerText: {
        margin: 12,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
        fontFamily: 'Montserrat',
        width: 80,
        maxWidth: 100,
    },

    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    view: {
        display: 'flex',
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignSelf: 'stretch',
    },
    recieptInfo: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        width: '100%',
    },
})

interface PDFDOCProps {
    order: OrderInfoWithReceiptOrInvoice
}
export default function PDFDoc({ order }: PDFDOCProps) {
    try {
        Font.register({
            family: 'Montserrat',
            fonts: [
                { src: Regular, fontWeight: 'normal' },
                { src: Bold, fontWeight: 'bold' },
            ],
        })
    } catch (e: any) {
        alert('An error has occurred: ' + e.message)
    }

    const subTotal = calculateDiscountedSubTotal(order.order.items)
    return (
        <Document>
            <Page size="A4" style={styles.body}>
                <View style={styles.title}>
                    <Text>Savannah Glow</Text>
                    <View style={styles.recieptInfo}>
                        <View style={{ width: '50%' }}>
                            <View style={styles.view}>
                                <Text
                                    style={{
                                        ...styles.text,
                                        margin: 5,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {order.order.payment === 'COD'
                                        ? `Invoice ID:`
                                        : 'Receipt ID:'}
                                </Text>
                                <Text style={{ ...styles.text, margin: 5 }}>
                                    {order.invoiceID
                                        ? leadingZeros(5, order.invoiceID)
                                        : order.receiptID
                                        ? leadingZeros(5, order.receiptID)
                                        : 'null'}
                                </Text>
                            </View>
                            <View style={styles.view}>
                                <Text
                                    style={{
                                        ...styles.text,
                                        margin: 5,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Date:
                                </Text>
                                <Text style={{ ...styles.text, margin: 5 }}>
                                    3/04/2021
                                </Text>
                            </View>
                            <View style={styles.view}>
                                <Text
                                    style={{
                                        ...styles.text,
                                        margin: 5,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Payment:
                                </Text>
                                <Text style={{ ...styles.text, margin: 5 }}>
                                    PayStack
                                </Text>
                            </View>
                        </View>
                        <View style={{ width: '50%' }}>
                            <View style={styles.view}>
                                <Text
                                    style={{
                                        ...styles.text,
                                        margin: 5,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Receiver:
                                </Text>
                                <Text style={{ ...styles.text, margin: 5 }}>
                                    Lukman Ahmed
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Text>Order Summary</Text>
                    <View style={styles.view}>
                        <View>
                            <Text style={styles.headerText}>Product</Text>
                        </View>
                        <View>
                            <Text style={styles.headerText}>Quantity</Text>
                        </View>
                        <View>
                            <Text style={styles.headerText}>
                                Unit Price (GHS)
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.headerText}>
                                Unit Discount (GHS)
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.headerText}>
                                Total Price (GHS)
                            </Text>
                        </View>
                    </View>
                    {order.order.items.map((item) => (
                        <View style={styles.view}>
                            <View>
                                <Text style={styles.text}>{item.name}</Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        ...styles.text,
                                        textAlign: 'right',
                                        paddingRight: 15,
                                    }}
                                >
                                    {item.quantity}
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        ...styles.text,
                                        textAlign: 'right',
                                        paddingRight: 15,
                                    }}
                                >
                                    {item.price.toFixed(2)}
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        ...styles.text,
                                        textAlign: 'right',
                                        paddingRight: 15,
                                    }}
                                >
                                    {(item.discount
                                        ? item.discount
                                        : 0
                                    ).toFixed(2)}
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        ...styles.text,
                                        textAlign: 'right',
                                        paddingRight: 15,
                                    }}
                                >
                                    {(
                                        item.quantity *
                                        (item.price - item.discount)
                                    ).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    ))}
                    <View
                        style={{ ...styles.view, justifyContent: 'flex-end' }}
                    >
                        <Text style={{ ...styles.text, fontWeight: 'bold' }}>
                            Sub Total:
                        </Text>
                        <Text
                            style={{
                                ...styles.text,
                                textAlign: 'right',
                                paddingRight: 17,
                            }}
                        >
                            {subTotal}
                        </Text>
                    </View>
                    <View
                        style={{ ...styles.view, justifyContent: 'flex-end' }}
                    >
                        <Text style={{ ...styles.text, fontWeight: 'bold' }}>
                            Shipping:
                        </Text>
                        <Text
                            style={{
                                ...styles.text,
                                textAlign: 'right',
                                paddingRight: 17,
                            }}
                        >
                            0.00
                        </Text>
                    </View>
                    <View
                        style={{ ...styles.view, justifyContent: 'flex-end' }}
                    >
                        <Text style={{ ...styles.text, fontWeight: 'bold' }}>
                            Total:
                        </Text>
                        <Text
                            style={{
                                ...styles.text,
                                textAlign: 'right',
                                paddingRight: 17,
                            }}
                        >
                            {subTotal}
                        </Text>
                    </View>
                </View>
                <View style={styles.header}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    )
}
