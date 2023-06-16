import React, { useEffect, useState, useRef } from 'react'
import {
    useUser,
    useSigninCheck,
    useFirestore,
    useAuth,
    useFirestoreDocData,
} from 'reactfire'
import { doc, FieldValue, Firestore, setDoc } from 'firebase/firestore'
import styled from 'styled-components'
import { Button } from '../layout/navbar'
import { Card } from '../supportingui/card'
import { Remove } from '../address/addresscard'
import { Input } from '../address/addressform'
import { DeleteCartItem } from '../address/addresscard'
import { Link } from 'gatsby'
import {
    calculateSubTotal,
    calculateDiscountedSubTotal,
    calculateTotalDiscount,
} from '../../helperfunctions'
import { VarietyProps } from '../product/product'
import { GatsbyImage } from 'gatsby-plugin-image'

const CartWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    position: relative;
    justify-content: center;
    max-width: 1200px;
    margin: 0px auto;
    .mobileV {
        flex: 1 0 300px;
        @media only screen and (max-width: 750px) {
            flex: 1 0 100%;
            margin: 0px;
            order: 2;
        }
    }
`
const ProductImageWrapper = styled.div`
    position: relative;
    text-align: center;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    max-width: 900px;

    font-family: 'Montserrat', sans-serif;
    color: #35486f;
    text-align: left;
    ul {
        display: flex;
        padding: 0px;
        width: 100%;
        flex-wrap: wrap;
    }

    li {
        position: relative;
        display: flex;
        width: 100%;
        margin: 2vw;
        flex-wrap: wrap;
        justify-content: flex-start;
    }

    img {
        max-width: 200px;
        object-fit: contain;
    }
    hr {
        border: 0;
        border-top: 1px solid #979aae;
        width: 100%;
    }

    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
    }

    input[type='number'] {
        -moz-appearance: textfield;
    }
`
const CartLabel = styled.div`
    margin: 10px 0px;
`

export default function CartComponent({ location }: any) {
    return (
        <CartItems location={location}>
            {(cart) => <Subtotal cart={cart} />}
        </CartItems>
    )
}

interface CartItemsProps {
    children?: { (cart: any): JSX.Element }
    location: any
}

interface LoggedInCartProp {
    collection: string
}

export function CartItems({ children, location }: CartItemsProps) {
    const [subtotal, setSubtotal] = useState(0)
    const [discountedSubTotal, setDiscountedSubTotal] = useState(0)
    const [totalDiscount, setTotalDiscount] = useState(0)
    const db = useFirestore()
    const { data: user } = useUser()
    const { status, data: signInCheckResult } = useSigninCheck()
    const auth = useAuth()
    console.log(location)

    // To be refactored
    const LoggedInCart = ({ collection }: LoggedInCartProp) => {
        const cartRef = doc(db, collection, user ? user.uid : '')
        const { data: cart } = useFirestoreDocData(cartRef)

        const items: VarietyProps[] = cart && cart.items

        //consider moving to cartItem
        const deleteCartItem = (index: number) => {
            const currentItems = [...items]
            currentItems.splice(index, 1)
            const newQuantity = currentItems.reduce(
                (prev, cur) => prev + cur.quantity,
                0
            )
            if (user)
                setDoc(
                    doc(db, collection, user.uid),
                    {
                        items: currentItems,
                        numberOfItems: newQuantity,
                        totalAmount: calculateSubTotal(currentItems),
                        discountedTotal:
                            calculateDiscountedSubTotal(currentItems),
                        totalDiscount: calculateTotalDiscount(currentItems),
                    },
                    { merge: true }
                )
                    .then(() => console.log('Cart item deleted'))
                    .catch((e) => console.log(e))
        }

        //consider moving to cartItem
        const updateCart = (index: number, quantity: number) => {
            const currentItems = [...items]
            currentItems[index].quantity = quantity
            currentItems[index].total = quantity * currentItems[index].price
            const newQuantity = currentItems.reduce(
                (prev, cur) => prev + cur.quantity,
                0
            )
            console.log(currentItems)
            if (user)
                setDoc(
                    doc(db, collection, user.uid),
                    {
                        items: currentItems,
                        numberOfItems: newQuantity,
                        totalAmount: calculateSubTotal(currentItems),
                        discountedTotal:
                            calculateDiscountedSubTotal(currentItems),
                        totalDiscount: calculateTotalDiscount(currentItems),
                    },
                    { merge: true }
                )
                    .then(() => console.log('Cart updated'))
                    .catch((e) => console.log(e))
        }

        const updateDiscount = (index: number, discount: number) => {
            const currentItems = [...items]
            currentItems[index].discount = discount
            currentItems[index].total =
                (currentItems[index].price - discount) *
                currentItems[index].quantity
            if (user)
                setDoc(
                    doc(db, collection, user.uid),
                    {
                        items: currentItems,
                        totalAmount: calculateSubTotal(currentItems),
                        discountedTotal:
                            calculateDiscountedSubTotal(currentItems),
                        totalDiscount: calculateTotalDiscount(currentItems),
                    },
                    { merge: true }
                )
                    .then(() => console.log('Discount updated'))
                    .catch((e) => console.log(e))
        }

        useEffect(() => {
            if (items) {
                setSubtotal(calculateSubTotal(items))
                setTotalDiscount(calculateTotalDiscount(items))
                setDiscountedSubTotal(calculateDiscountedSubTotal(items))
            }
        }, [cart])

        if (location || (items && items.length > 0))
            return (
                <CartWrapper>
                    <Card
                        maxWidth="900px"
                        className="mobileV"
                        style={{ margin: '10px 0px' }}
                    >
                        <ProductImageWrapper>
                            <ul>
                                {items.map((item, index) => (
                                    <CartItem
                                        key={index}
                                        index={index}
                                        item={item}
                                        updateDiscount={updateDiscount}
                                        updateCart={updateCart}
                                        deleteCartItem={deleteCartItem}
                                        db={db}
                                    />
                                ))}
                            </ul>
                            {location &&
                            location.state &&
                            location.state.items ? (
                                <div
                                    style={{
                                        width: '100%',
                                        textAlign: 'right',
                                    }}
                                ></div>
                            ) : (
                                <div
                                    style={{
                                        width: '100%',
                                        textAlign: 'right',
                                    }}
                                >{`Subtotal: GHS ${cart.discountedTotal}`}</div>
                            )}
                        </ProductImageWrapper>
                    </Card>
                    {children && children(cart)}
                </CartWrapper>
            )
        else return <div>No items in your Cart</div>
    }
    if (!user) {
        return <div>No items in your Cart</div>
    } else
        return (
            <LoggedInCart
                collection={
                    location && location.state && location.state.fromFeed
                        ? 'buyNow'
                        : 'carts'
                }
            />
        )
}

interface CartItemProps {
    item: VarietyProps
    updateCart: (index: number, quantity: number) => void
    deleteCartItem: (index: number) => void
    updateDiscount: (index: number, quantity: number) => void
    index: number
    db: Firestore
}
function CartItem({
    item,
    updateCart,
    index,
    deleteCartItem,
    db,
    updateDiscount,
}: CartItemProps) {
    console.log('item', item)
    const imgSrc = item.images[0].localFile.childImageSharp.gatsbyImageData
    const qtyRef = useRef()
    const [qty, setQty] = useState(item.quantity)
    const [deleteDialog, setDeleteDialog] = useState(false)

    const availableRef = doc(db, 'product', item.id)
    const { status, data: product } = useFirestoreDocData(availableRef)
    console.log(product.available)
    const increaseItems = () => {
        if (qty + 1 <= product.available) setQty((prev) => prev + 1)
    }

    const decreaseItems = () => {
        if (qty - 1 > 0) setQty((prev) => prev - 1)
    }

    useEffect(() => {
        if (updateDiscount && product.discount != item.discount)
            updateDiscount(index, product.discount)
    }, [product])
    //add useeffect to check if item quantity is below set quantity
    useEffect(() => {}, [item])

    return (
        <>
            <li>
                <Remove
                    style={{ top: -15 }}
                    onClick={() => setDeleteDialog(true)}
                />
                <DeleteCartItem
                    showModal={deleteDialog}
                    index={index}
                    setShowDialog={setDeleteDialog}
                    deleteItem={deleteCartItem}
                    title="Are you sure you want to delete this item?"
                />

                <GatsbyImage
                    style={{ margin: 10, flex: '0 0 200px' }}
                    image={imgSrc}
                    alt={item.name}
                />
                <div>
                    <CartLabel>
                        <h3 style={{ marginTop: 0 }}>{item.productName}</h3>
                    </CartLabel>
                    <CartLabel>{item.name}</CartLabel>
                    {product.discount ? (
                        <>
                            <CartLabel>
                                <span
                                    style={{
                                        color: 'gray',
                                        textDecoration: 'line-through',
                                    }}
                                >{`GHS ${item.price.toFixed(2)}`}</span>
                            </CartLabel>
                            <CartLabel>
                                <span>{`GHS ${(
                                    item.price - product.discount
                                ).toFixed(2)}`}</span>
                            </CartLabel>
                        </>
                    ) : (
                        <CartLabel>{`GHS ${item.price.toFixed(2)}`}</CartLabel>
                    )}
                    <CartLabel>
                        <Button
                            type="button"
                            style={{ width: 50 }}
                            secondary
                            onClick={decreaseItems}
                        >
                            -
                        </Button>
                        <Input
                            onChange={(e) => {
                                ;+e.target.value > product.available
                                    ? setQty(product.available)
                                    : setQty(+e.target.value)
                            }}
                            onBlur={() => {
                                qty > product.available
                                    ? setQty(product.available)
                                    : qty < 1
                                    ? setQty(1)
                                    : setQty(qty)
                            }}
                            min={1}
                            max={product.available}
                            value={qty}
                            type="number"
                            style={{ width: 50, padding: 8 }}
                        />
                        <Button
                            type="button"
                            style={{ width: 50 }}
                            secondary
                            onClick={increaseItems}
                        >
                            +
                        </Button>
                        {qty != item.quantity && (
                            <Button
                                type="button"
                                onClick={() => updateCart(index, qty)}
                            >
                                Update Cart
                            </Button>
                        )}
                    </CartLabel>
                    <CartLabel>
                        {`Item Total: GHS ${(
                            (item.price - product.discount) *
                            qty
                        ).toFixed(2)}`}
                    </CartLabel>
                </div>
            </li>
            <hr></hr>
        </>
    )
}

export interface CartProps {
    items: VarietyProps[]
    numberOfItems: number
    totalAmount: number
    discountedTotal: number
    user: string
    dateCreated: FieldValue
}

export interface SubTotalProps {
    cart: CartProps
    isSubmitting?: boolean
}

function Subtotal({ cart }: SubTotalProps) {
    return (
        <Card
            style={{
                position: 'sticky',
                top: 20,
                alignContent: 'flex-start',
                justifyContent: 'center',
                textAlign: 'center',
                maxHeight: 150,
                fontFamily: `'Montserrat', sans-serif`,
            }}
        >
            <div
                style={{ width: '100%', padding: 20 }}
            >{`Subtotal(${cart.numberOfItems} items): GHS ${cart.discountedTotal}`}</div>
            <Link
                style={{ textDecoration: 'none', color: 'white' }}
                to="/user/checkout"
                state={{ fromFeed: false }}
            >
                <Button
                    primary
                    style={{ minWidth: 'fit-content', width: 250 }}
                    onClick={() => {}}
                >
                    Check Out
                </Button>
            </Link>
        </Card>
    )
}
