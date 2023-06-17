import React from 'react'
import { Link } from 'gatsby'
import {
    Highlight,
    Hits,
    Index,
    Snippet,
    PoweredBy,
    useStats,
} from 'react-instantsearch-hooks-web'
import slugify from '@sindresorhus/slugify'
import styled from 'styled-components'
import ProductItem from '../product/productitem'
import Errorwrapper from '../errorwrapper'
const SearchResultsWrapper = styled.div`
    max-width: 800px;
    min-width: fit-content;
    .Hits {
        ol {
            display: flex;
            list-style: decimal inside none;
            padding: 0px;
        }
    }
    .search-results {
        font-size: small;
        max-width: 100px;
        .gatsby-image-wrapper {
            width: 100px;
            height: 100px;
        }
    }
`

const HitCount = () => {
    const { nbHits } = useStats()

    return nbHits > 0 ? (
        <div className="HitCount">
            {nbHits} result{nbHits !== 1 ? 's' : ''}
        </div>
    ) : (
        <div>No results found</div>
    )
}

const PageHit = ({ hit, setShowModal }: any) => (
    <div onClick={() => setShowModal(false)}>
        <Errorwrapper>
            <Link
                to={`/products/${slugify(hit.name)}`}
                style={{ textDecoration: 'none' }}
            >
                <ProductItem
                    name={hit.name}
                    subName={hit.varieties.name}
                    price={`GHS ${hit.varieties.price}.00`}
                    imgSrc={
                        hit.varieties.images[0].localFile.childImageSharp
                            .gatsbyImageData
                    }
                    id={hit.id}
                    className="search-results"
                    ratingSize={15}
                    ratingInfo={[hit.productRating]}
                />
            </Link>
        </Errorwrapper>
        {/*<Snippet attribute="description" hit={hit} />*/}
    </div>
)

const HitsInIndex = ({ setShowModal, index }: any) => (
    <Index indexName={index.name}>
        <HitCount />
        <Hits
            className="Hits"
            hitComponent={({ hit }) => (
                <PageHit hit={hit} setShowModal={setShowModal} />
            )}
        />
    </Index>
)

const SearchResult = ({ setShowModal, indices, className = '' }: any) => (
    <SearchResultsWrapper className={className}>
        {indices.map((index: any) => (
            <HitsInIndex
                setShowModal={setShowModal}
                index={index}
                key={index.name}
            />
        ))}
        <PoweredBy />
    </SearchResultsWrapper>
)

export default SearchResult
