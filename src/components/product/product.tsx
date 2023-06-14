import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Button } from '../layout/navbar'
import {
    useUser,
    useSigninCheck,
    useFirestore,
    useAuth,
    useFirestoreDocData,
    ObservableStatus,
} from 'reactfire'
import {
    serverTimestamp,
    doc,
    setDoc,
    updateDoc,
    increment,
    arrayUnion,
    getDoc,
} from 'firebase/firestore'
import { signInAnonymously, User } from 'firebase/auth'
import Errorwrapper from '../errorwrapper'
import Review from './review'
import ModalComponent from '../supportingui/modal'
import { Formik, Form } from 'formik'
import { InputWrapper, Label, Input } from '../address/addressform'
import { Rating } from 'react-simple-star-rating'
import { Link, navigate } from 'gatsby'
import useRole from '../../hooks/useRole'
import { GatsbyImage } from 'gatsby-plugin-image'
import { RatingInfoProps } from './productitem'
const product = {
    width: '100px',
    height: '100px',
}

const bigProduct = {
    minWidth: 200,
    objectFit: 'cover',
    width: 400,
    maxHeight: 400,
} as React.CSSProperties

const ProductImageWrapper = styled.div`
    position: relative;
    text-align: center;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    ul {
        display: flex;
        padding: 0px;
        width: 100%;
    }

    li {
        display: block;
        cursor: pointer;
    }
`

const Selected = styled.div`
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    width: 100%;

    .selectable {
        width: 40px;
        height: 40px;
        object-fit: cover;
        padding: 10px;
    }
`
const ProductWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    section {
        width: 50%;
        padding: 20px;
        box-sizing: border-box;
        flex: 1 0 300px;
    }

    span,
    h2,
    h3,
    ul,
    .description {
        width: 100%;
        font-family: 'Montserrat', sans-serif;
        color: #35486f;
        text-align: left;
    }

    .highlight {
        border: 2px solid #35486f;
        box-shadow: 0 0 10px #9bb2e1;
    }

    .price {
        font-weight: 500;
        font-size: 24px;
        color: #3f51b5;
    }

    hr {
        border: 0;
        border-top: 1px solid #979aae;
    }

    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
    }

    input[type='number'] {
        -moz-appearance: textfield;
    }

    @media only screen and (max-width: 633px) {
        .top {
            order: 1;
            min-width: 100%;
        }
        .bottom {
            order: 2;
            min-width: 100%;
        }
    }

    .discount {
        display: flex;
        flex-wrap: wrap;
        span {
            margin: 0 2px;
            flex: 1 0 150px;
        }
    }
`
const VarietyList = styled.ul`
    padding: 0px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
`

const VarietyListItem = styled.li`
    display: block;
    width: 100px;
    border: 1px solid #7e7d7d;
    cursor: pointer;
    padding: 5px;
    margin: 5px;

    &:hover {
        background: #e0cbba;
    }
`
interface ProductProps {
    brand: string
    name: string
    id: string
    description: string
    varieties: VarietyProps[]
}

interface StrapiProductProps {
    data: { productInfo: ProductProps; productRating: RatingInfoProps }
}

export interface VarietyProps {
    productName: string
    brand: string
    name: string
    price: number
    discount: number
    id: string
    quantity: number
    images: {
        //fluid: { src: string; srcSet: string }
        id: string
        localFile: { childImageSharp: { gatsbyImageData: any } }
    }[]
    total: number
}
export default function Product({ data }: StrapiProductProps) {
    const [changeItemCountUI, setChangeItemCountUI] = useState(<></>)
    const [addToCartUI, setAddToCartUI] = useState(<></>)
    const [BuyNowUI, setBuyNowUI] = useState(<></>)
    const [ratingUI, setRatingUI] = useState(
        <small>This product has not been rated yet. Be the first.</small>
    )
    const [reviewsUI, setReviewsUI] = useState(<></>)
    const [productAdminSettingsUI, setProductAdminSettingsUI] = useState(<></>)

    const sgproduct = data.productInfo

    console.log(sgproduct)
    const transformVariety = (varieties: any[]) => {
        return varieties.map((variety: any) => {
            return {
                productName: sgproduct.name,
                brand: sgproduct.brand,
                ...variety,
            }
        })
    }
    /*const transformImageSource = (a: any[]) => {
        return a.map((x: any) => {
            return {
                ...x,
                quantity: 1,
                images: [
                    ...x.images.map((b: any) => {
                        return {
                            ...b,
                            fluid: {
                                src: b.localFile.childImageSharp.gatsbyImageData
                                    .images.fallback.src,
                                srcSet: b.localFile.childImageSharp
                                    .gatsbyImageData.images.sources[0].srcSet,
                            },
                        }
                    }),
                ],
            }
        })
    }*/
    //const varietiesTransformed = transformImageSource(sgproduct.varieties)
    //console.log('varieties transformed', varietiesTransformed)
    const transformedVarieties = transformVariety(sgproduct.varieties)
    const [selectedVariety, setSelectedVariety] = useState<VarietyProps>(
        transformedVarieties[0] as VarietyProps
    )
    const [discountUI, setDiscountUI] = useState(
        <div className="description price">{`GHS ${selectedVariety.price.toFixed(
            2
        )}`}</div>
    )
    const [selectedImage, setSelectedImage] = useState(0)
    const [qty, setQty] = useState(1)

    console.log(selectedVariety)

    useEffect(() => {
        setAddToCartUI(
            <Errorwrapper>
                <AddtoCartButton selectedVariety={selectedVariety} />
            </Errorwrapper>
        )
        setBuyNowUI(
            <Errorwrapper>
                <BuyNowButton selectedVariety={selectedVariety} qty={qty} />
            </Errorwrapper>
        )
        setRatingUI(
            <Errorwrapper>
                <ProductRating productID={sgproduct.id} />
            </Errorwrapper>
        )
        setChangeItemCountUI(
            <Errorwrapper>
                <ChangeItemCount
                    varietyID={selectedVariety.id}
                    qty={qty}
                    setQty={setQty}
                />
            </Errorwrapper>
        )
        setDiscountUI(
            <Errorwrapper>
                <DiscountUI selectedVariety={selectedVariety} />
            </Errorwrapper>
        )
        setProductAdminSettingsUI(
            <Errorwrapper>
                <ProductAdminSettings selectedVariety={selectedVariety} />
            </Errorwrapper>
        )
        setReviewsUI(
            <Errorwrapper>
                <Review productName={sgproduct.name} productId={sgproduct.id} />
            </Errorwrapper>
        )
    }, [])

    useEffect(() => {
        setSelectedImage(0)
        setProductAdminSettingsUI(
            <Errorwrapper>
                <ProductAdminSettings selectedVariety={selectedVariety} />
            </Errorwrapper>
        )
        setDiscountUI(
            <Errorwrapper>
                <DiscountUI selectedVariety={selectedVariety} />
            </Errorwrapper>
        )
        setChangeItemCountUI(
            <Errorwrapper>
                <ChangeItemCount
                    varietyID={selectedVariety.id}
                    qty={qty}
                    setQty={setQty}
                />
            </Errorwrapper>
        )
        setAddToCartUI(
            <Errorwrapper>
                <AddtoCartButton selectedVariety={selectedVariety} />
            </Errorwrapper>
        )
        setBuyNowUI(
            <Errorwrapper>
                <BuyNowButton selectedVariety={selectedVariety} qty={qty} />
            </Errorwrapper>
        )
    }, [selectedVariety])

    useEffect(() => {
        setSelectedVariety((prev) => {
            return { ...prev, quantity: qty }
        })
        setChangeItemCountUI(
            <Errorwrapper>
                <ChangeItemCount
                    varietyID={selectedVariety.id}
                    qty={qty}
                    setQty={setQty}
                />
            </Errorwrapper>
        )
        setBuyNowUI(
            <Errorwrapper>
                <BuyNowButton selectedVariety={selectedVariety} qty={qty} />
            </Errorwrapper>
        )
    }, [qty])

    return (
        <ProductWrapper>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    maxWidth: 1200,
                    justifyContent: 'center',
                }}
            >
                <section>
                    <Selected>
                        <ProductImageWrapper>
                            <GatsbyImage
                                style={bigProduct}
                                image={
                                    selectedVariety.images[selectedImage]
                                        .localFile.childImageSharp
                                        .gatsbyImageData
                                }
                                alt={selectedVariety.name}
                            />
                            <VarietyList>
                                {selectedVariety.images.map((image, index) => (
                                    <VarietyListItem
                                        style={{
                                            maxWidth: 'fit-content',
                                            padding: 0,
                                        }}
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`${
                                            selectedVariety.images[
                                                selectedImage
                                            ].id == image.id
                                                ? 'highlight'
                                                : ''
                                        }`}
                                    >
                                        <>
                                            {console.log(
                                                selectedVariety.images[index]
                                                    .id,
                                                image.id
                                            )}
                                            <GatsbyImage
                                                image={
                                                    image.localFile
                                                        .childImageSharp
                                                        .gatsbyImageData
                                                }
                                                className={`selectable`}
                                                alt={selectedVariety.name}
                                            />
                                        </>
                                    </VarietyListItem>
                                ))}
                            </VarietyList>
                            <VarietyList>
                                {sgproduct.varieties.map((variety, index) => (
                                    <VarietyListItem
                                        className={`${
                                            selectedVariety.name == variety.name
                                                ? 'highlight'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            setSelectedVariety(
                                                sgproduct.varieties[index]
                                            )
                                        }}
                                        key={index}
                                    >
                                        {variety.name}
                                    </VarietyListItem>
                                ))}
                            </VarietyList>
                        </ProductImageWrapper>
                    </Selected>
                </section>
                <section>
                    <h2>{sgproduct.name}</h2>
                    {ratingUI}
                    <hr></hr>
                    <div className="description">{sgproduct.description}</div>
                    <hr></hr>
                    {discountUI}
                    {changeItemCountUI}
                    <div>{productAdminSettingsUI}</div>
                    <div
                        style={{
                            margin: '10px 0px',
                            display: 'flex',
                            flexWrap: 'wrap',
                        }}
                    >
                        {BuyNowUI}
                        <Errorwrapper>{addToCartUI}</Errorwrapper>
                    </div>
                </section>
            </div>
            <div
                style={{
                    width: '100%',
                    maxWidth: 1200,
                    display: 'flex',
                    flexWrap: 'wrap',
                }}
            >
                {reviewsUI}
            </div>
        </ProductWrapper>
    )
}

interface DiscountUIProps {
    selectedVariety: VarietyProps
}

function DiscountUI({ selectedVariety }: DiscountUIProps) {
    const db = useFirestore()
    const ref = doc(db, 'product', selectedVariety.id)
    const { data: product } = useFirestoreDocData(
        ref
    ) as ObservableStatus<ProductSettingProps>
    return (
        <>
            {product && product.discount ? (
                <div className="discount">
                    <span>
                        <small>now: </small>
                        <span className="price">{`GHS ${(
                            selectedVariety.price - product.discount
                        ).toFixed(2)}`}</span>
                    </span>
                    <span>
                        <small>was:</small>
                        <span
                            style={{
                                textDecoration: 'line-through',
                            }}
                        >{`GHS ${selectedVariety.price.toFixed(2)}`}</span>
                    </span>
                    <span>
                        <small>save:</small>
                        {`GHS ${product.discount.toFixed(2)} (${(
                            (product.discount * 100) /
                            selectedVariety.price
                        ).toFixed(2)}%)`}
                    </span>
                </div>
            ) : (
                <div className="description price">{`GHS ${selectedVariety.price.toFixed(
                    2
                )}`}</div>
            )}
        </>
    )
}

interface ProductRatingProps {
    productID: string
}
function ProductRating({ productID }: ProductRatingProps) {
    const db = useFirestore()

    const docRef = doc(db, 'products', productID)
    const [productRating, setProductRating] = useState<number | null>(null)

    useEffect(() => {
        getDoc(docRef).then((data) => {
            const productValues = data.data()
            if (productValues && productValues.rating)
                setProductRating(productValues.rating)
        })
    }, [])

    return (
        <>
            {productRating ? (
                <Rating
                    allowFraction
                    initialValue={productRating ? productRating : 0}
                    readonly={true}
                    size={25}
                    style={{ width: 'fit-content' }}
                />
            ) : (
                <small>
                    This product has not been rated yet. Be the first.
                </small>
            )}
        </>
    )
}

interface ChangeItemCountProps {
    qty: number
    setQty: React.Dispatch<React.SetStateAction<number>>
    varietyID: string
}

export function ChangeItemCount({
    qty,
    setQty,
    varietyID,
}: ChangeItemCountProps) {
    const db = useFirestore()
    const ref = doc(db, 'product', varietyID)
    const { data: product } = useFirestoreDocData(
        ref
    ) as ObservableStatus<ProductSettingProps>

    const changeItemCount = (changeQty: number) => {
        if (qty + changeQty > product.available) setQty(product.available)
        else if (qty + changeQty < 1) setQty(1)
        else setQty((prev: number) => prev + changeQty)
    }

    const handleChange = (e: any) => {
        product.available < +e.target.value
            ? setQty(product.available)
            : setQty(+e.target.value)
    }

    if (product)
        return (
            <>
                <Button
                    secondary
                    onClick={() => changeItemCount(-1)}
                    style={{ width: 50 }}
                >
                    -
                </Button>
                <Input
                    onChange={handleChange}
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
                    secondary
                    onClick={() => changeItemCount(1)}
                    style={{ width: 50 }}
                >
                    +
                </Button>
                <span>
                    {product
                        ? product.available + ' available'
                        : 'Available not set'}
                </span>
            </>
        )
    else return <div>Loading...</div>
}

interface BuyNowButtonProps {
    selectedVariety: VarietyProps
    qty: number
}

function BuyNowButton({ selectedVariety, qty }: BuyNowButtonProps) {
    const { data: signInCheckResult } = useSigninCheck()
    const db = useFirestore()
    const auth = useAuth()
    const { data: user } = useUser()

    const buyNow = () => {
        if (!signInCheckResult.signedIn) {
            signInAnonymously(auth).then(({ user }) => {
                setDoc(doc(db, 'buyNow', user.uid), {
                    user: user.uid,
                    items: [selectedVariety],
                    numberOfItems: qty,
                    dateCreated: serverTimestamp(),
                }).then(() => {
                    navigate('/user/checkout', {
                        state: { fromFeed: true },
                    })
                })
            })
        } else if (user && user.uid)
            setDoc(doc(db, 'buyNow', user.uid), {
                user: user.uid,
                items: [selectedVariety],
                numberOfItems: qty,
                dateCreated: serverTimestamp(),
            }).then(() => {
                navigate('/user/checkout', { state: { fromFeed: true } })
            })
    }

    return (
        <Link to="/user/checkout/" state={{ fromFeed: true }}>
            <Button primary onClick={() => buyNow()}>
                Buy Now
            </Button>
        </Link>
    )
}

interface AddToCartProps {
    selectedVariety: VarietyProps
}

function AddtoCartButton({ selectedVariety }: AddToCartProps) {
    const { status, data: signInCheckResult } = useSigninCheck()
    const db = useFirestore()
    const auth = useAuth()
    const { data: user } = useUser()

    console.log(signInCheckResult)

    const addCart = (cartUser: User) => {
        console.log('cart user', cartUser)
        setDoc(doc(db, 'carts', cartUser.uid), {
            user: cartUser.uid,
            items: [selectedVariety],
            numberOfItems: selectedVariety.quantity,
            dateCreated: serverTimestamp(),
        })
            .then(() => console.log('cart added'))
            .catch((e) => console.log(e))
    }

    const addCartAnonymousUser = () => {
        if (!signInCheckResult.signedIn) {
            signInAnonymously(auth)
                .then(({ user }) => {
                    addCart(user)
                })
                .catch((error) => {
                    const errorCode = error.code
                    const errorMessage = error.message
                    console.log(error)
                    // ...
                })
        }
    }

    console.log(user && user.uid)
    const cartRef = doc(db, 'carts', user ? user.uid : 'NO_USER')
    const { data: cart } = useFirestoreDocData(cartRef)

    const addToCart = () => {
        if (signInCheckResult.signedIn && user && !cart) {
            addCart(user)
        } else if (cart) {
            const findIndexOfVariety = cart.items.findIndex(
                (item: VarietyProps) => item.name == selectedVariety.name
            )
            console.log('index', findIndexOfVariety)
            if (findIndexOfVariety > -1) {
                const newItems = [...cart.items]
                newItems[findIndexOfVariety].quantity +=
                    selectedVariety.quantity
                console.log('newitems', newItems)
                if (user && user.uid)
                    setDoc(
                        doc(db, 'carts', user.uid),
                        {
                            items: newItems,
                        },
                        { merge: true }
                    )
                        .then(() =>
                            updateDoc(doc(db, 'carts', user.uid), {
                                numberOfItems: increment(
                                    selectedVariety.quantity
                                ),
                            })
                                .then(() => console.log('quantity increased'))
                                .catch((e) => console.log(e))
                        )
                        .then(() => console.log('an item quantity increased'))
                        .catch((e) => console.log(e))
                else {
                    console.log('User not found ', user)
                }
            } else {
                if (user && user.uid)
                    updateDoc(doc(db, 'carts', user.uid), {
                        items: arrayUnion(selectedVariety),
                        numberOfItems: increment(selectedVariety.quantity),
                    })
                        .then(() => console.log('address updated'))
                        .catch((e) => console.log(e))
                else {
                    console.log('User not found ', user)
                }
            }
        }
    }

    if (status == 'success') {
        if (!user)
            return (
                <Button secondary onClick={addCartAnonymousUser}>
                    Add To Bag
                </Button>
            )
        else if (signInCheckResult.signedIn && user && user.uid)
            return (
                <Button secondary onClick={addToCart}>
                    Add To Bag
                </Button>
            )
        else return <div>Loading...</div>
    } else if (status == 'loading') return <div>Loading...</div>
    else return <div>Something went wrong...</div>
}

interface ProductSettingModalProps {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
    price: number
    varietyID: string
}

interface ProductAdminSettingsProps {
    selectedVariety: VarietyProps
}
function ProductAdminSettings({ selectedVariety }: ProductAdminSettingsProps) {
    const { role } = useRole()
    const { data: user } = useUser()
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            {((user && role == 'admin 1') || role == 'admin 2') && (
                <>
                    <Button secondary onClick={() => setShowModal(true)}>
                        Set Available
                    </Button>
                    <Errorwrapper>
                        <ProductSetting
                            showModal={showModal}
                            price={selectedVariety.price}
                            setShowModal={setShowModal}
                            varietyID={selectedVariety.id}
                        />
                    </Errorwrapper>
                </>
            )}
        </>
    )
}

interface ProductSettingProps {
    available: number
    discount: number
}

function ProductSetting({
    showModal,
    setShowModal,
    varietyID,
    price,
}: ProductSettingModalProps) {
    const db = useFirestore()
    const ref = doc(db, 'product', varietyID)
    const { data: productResult } = useFirestoreDocData(
        ref
    ) as ObservableStatus<ProductSettingProps>

    const product = productResult
        ? productResult
        : { available: 0, discount: 0 }
    const { available = 0, discount = 0 } = product
    useEffect(() => {
        if (!product) {
            setProductSettings({ available: 0, discount: 0 })
        }
    }, [])

    useEffect(() => {
        if (!product) {
            setProductSettings({ available: 0, discount: 0 })
        }
    }, [varietyID])

    const setProductSettings = (settings: ProductSettingProps) => {
        setDoc(
            ref,
            {
                ...settings,
            },
            { merge: true }
        )
            .then(() => {
                console.log('Available quantity set')
                setShowModal(false)
            })
            .catch((e) => console.log(e))
    }

    return (
        <ModalComponent showModal={showModal} setShowModal={setShowModal}>
            <Formik
                initialValues={{
                    available: available,
                    discount: discount,
                }}
                onSubmit={(
                    values: ProductSettingProps,
                    { setSubmitting }: any
                ) => {
                    console.log(values)
                    setTimeout(() => {
                        setProductSettings(values)
                        setSubmitting(false)
                    }, 400)
                }}
            >
                {({
                    isSubmitting,
                    setFieldValue,
                    handleChange,
                    values,
                    handleSubmit,
                }: any) => (
                    <Form
                        style={{
                            width: '500px',
                            display: 'flex',
                            flexWrap: 'wrap',
                        }}
                    >
                        <InputWrapper style={{ minWidth: '100%' }}>
                            <Label htmlFor="available"> Available</Label>
                            <Input
                                min={1}
                                onChange={handleChange}
                                value={values.available}
                                name="available"
                                type="number"
                                style={{
                                    width: 50,
                                    padding: 8,
                                }}
                            />
                        </InputWrapper>
                        <InputWrapper style={{ minWidth: '100%' }}>
                            <Label htmlFor="discount"> Discount</Label>
                            <Input
                                min={0}
                                max={price}
                                step="0.01"
                                onChange={handleChange}
                                value={values.discount}
                                name="discount"
                                type="number"
                                style={{
                                    width: 50,
                                    padding: 8,
                                }}
                            />
                        </InputWrapper>
                        <Button
                            secondary
                            onClick={() => setShowModal(false)}
                            type="button"
                            style={{
                                width: 100,
                                display: 'flex',
                                margin: '10px',
                                height: 40,
                                fontSize: 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            CANCEL
                        </Button>
                        <Button
                            primary
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: 100,
                                display: 'flex',
                                margin: '10px',
                                height: 40,
                                fontSize: 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onClick={() => {
                                handleSubmit
                            }}
                        >
                            DONE
                        </Button>
                    </Form>
                )}
            </Formik>
        </ModalComponent>
    )
}
