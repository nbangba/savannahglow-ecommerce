import React, { useEffect, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import styled, { css } from 'styled-components'
import { query as q, getDoc, doc } from 'firebase/firestore'
import { useFirestore } from 'reactfire'
import Errorwrapper from '../errorwrapper'
import { GatsbyImage } from 'gatsby-plugin-image'

const ProductImageWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    position: relative;
    width: fit-content;
    max-width: 200px;
    text-align: center;
    padding: 20px;
    justify-content: center;
    .gatsby-image-wrapper {
        width: 200px;
        height: 200px;
        object-fit: contain;
    }
`
const ProductLabels = styled.div`
    width: 150px;

    ${(props: { price?: boolean }) =>
        props.price &&
        css`
            font-weight: bold;
            color: blue;
        `}
`

interface ProductItemProps {
    name: string
    subName: string
    price: string
    imgSrc: any
    id: string
    ratingInfo?: RatingInfoProps[]
    className?: string
    ratingSize?: number
}

export interface RatingInfoProps {
    fields: {
        productName: { stringValue: string }
        numberOfRating: { integerValue: number }
        rating: DoubleRatingProps | IntegerRatingProps
    }
}

interface DoubleRatingProps {
    integerValue: never
    doubleValue: number
}
interface IntegerRatingProps {
    integerValue: number
    doubleValue: never
}
export default function ProductItem({
    name,
    subName,
    price,
    imgSrc,
    id,
    ratingInfo,
    className,
    ratingSize = 25,
}: ProductItemProps) {
    const initialRating =
        ratingInfo && ratingInfo.length > 0
            ? ratingInfo[0].fields.rating.integerValue |
              ratingInfo[0].fields.rating.doubleValue
            : 0

    const [ratingUI, setRatingUI] = useState(
        <Errorwrapper>
            <Rating
                allowFraction
                initialValue={initialRating}
                readonly={true}
                size={ratingSize}
                style={{ width: 'fit-content' }}
            />
        </Errorwrapper>
    )

    /*useEffect(() => {
        if (id)
            setRatingUI(
                <Errorwrapper>
                    <ProductItemRating name={name} id={id} />
                </Errorwrapper>
            )
    }, [])*/

    return (
        <ProductImageWrapper
            className={className}
            style={{ textDecoration: 'none' }}
        >
            <GatsbyImage image={imgSrc} alt={name} />
            {ratingUI}
            <ProductLabels>{name}</ProductLabels>

            <ProductLabels price>{price}</ProductLabels>
        </ProductImageWrapper>
    )
}

interface ProductItemRatingProps {
    name: string
    id: string
}
function ProductItemRating({ name, id }: ProductItemRatingProps) {
    const [productRating, setProductRating] = useState<number | null>(null)
    const db = useFirestore()
    console.log(id)
    const productsRef = doc(db, 'products', id)

    useEffect(() => {
        getDoc(productsRef).then((data) => {
            const productValues = data.data()
            console.log(productValues)
            if (productValues && productValues.rating)
                setProductRating(productValues.rating)
        })
    }, [])

    return (
        <Rating
            allowFraction
            initialValue={productRating ? productRating : 0}
            readonly={true}
            size={15}
            style={{ width: 'fit-content' }}
        />
    )
}
