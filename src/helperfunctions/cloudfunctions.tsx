import { getFunctions, httpsCallable } from 'firebase/functions'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { collection, addDoc, getFirestore } from 'firebase/firestore'
import { VarietyProps } from '../components/product/product'
import { InfoProps } from '../components/checkout/checkout'
import { OrderInfoProps } from '../components/admin/adminCustomerOrders'
import { ReviewProps } from '../components/product/review'

export async function verifyPaystack(info: InfoProps, response: any) {
    const functions = getFunctions()
    const verify = httpsCallable(functions, 'payStackTransctionVerification')
    const firestore = getFirestore()
    return await verify({ info: info, response: response })
        .then((result) => {
            console.log(response.status)
            console.log(result)
            if (response.status === 'success') {
                const items = info.items.map((item: VarietyProps) => {
                    return {
                        item_name: item.name,
                        price: item.price,
                        discount: item.discount,
                        quantity: item.quantity,
                        currency: 'GHS',
                    }
                })
                const analytics = getAnalytics()
                logEvent(analytics, 'purchase', {
                    currency: 'GHS',
                    transaction_id: response.reference,
                    value: info.amount,
                    items: items,
                })

                addDoc(collection(firestore, 'mail'), {
                    to: ['nbangba.la@gmail.com'],
                    template: {
                        name: 'orderStatus',
                        data: {
                            ...info,
                            orderStatus: 'received',
                        },
                    },
                }).catch((e) => console.log(e))
                console.log('success')
            }
            //window.location = "http://localhost:8000/verification/" + response.reference;
            return result
        })
        .catch((err) => console.log(err))
}

export async function chargeCard(info: InfoProps, cardId: string) {
    const functions = getFunctions()
    const chargeCardFn = httpsCallable(functions, 'chargeCard')

    const result = await chargeCardFn({ info: info, docId: cardId })
        .then((result) => {
            console.log('Charge card result', result)
            return result
        })
        .catch((e) => console.log(e))

    return result
}

export async function payOnDelivery(info: InfoProps) {
    const functions = getFunctions()
    const payOnDeliveryFn = httpsCallable(functions, 'payOnDelivery')

    return await payOnDeliveryFn({ info: info })
        .then((result) => {
            console.log('Pay on deliver result', result)
            return result
        })
        .catch((e) => console.log(e))
}

export async function refund(order: OrderInfoProps) {
    const functions = getFunctions()
    const createRefund = httpsCallable(functions, 'createRefund')
    const firestore = getFirestore()

    const results = await createRefund({
        transactionID: order.NO_ID_FIELD || order.response.reference,
        amount: order.order.amount * 100 + '',
        payment: order.order.payment,
    })
        .then((result) => {
            addDoc(collection(firestore, 'mail'), {
                to: ['nbangba.la@gmail.com'],
                template: {
                    name: 'orderStatus',
                    data: {
                        ...order.order,
                        orderStatus: 'cancelled',
                    },
                },
            })
            console.log('refund result', result)
            return result
        })
        .catch((e) => console.log(e))
    return results
}

export async function deleteUsers(selectedRows: any) {
    const functions = getFunctions()
    console.log(selectedRows)
    const selected = selectedRows.map((e: any) => e.original)
    console.log(selected)
    const deleteUsersFn = httpsCallable(functions, 'deleteUsers')
    const data: any = await deleteUsersFn({ selectedRows: selected })
    console.log(data)
    if (data.data && data.data.result.length > 0) return 'success'
    else return 'error'
}

export function assignRole(role: string, selectedRows: any) {
    const selected = selectedRows.map((e: any) => e.original)
    const functions = getFunctions()
    const assignRoleFn = httpsCallable(functions, 'assignRole')
    assignRoleFn({ role: role, selectedRows: selected })
        .then((data) => console.log('User assigned role ' + data))
        .catch((e) => console.log(e))
}

export function rateProduct(values: ReviewProps) {
    const functions = getFunctions()
    const rateProductFn = httpsCallable(functions, 'rateProduct')

    rateProductFn({ values: values })
        .then(() => console.log('You rated this product'))
        .catch((e) => console.log(e))
}
