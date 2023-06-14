import React from 'react'
import { InstantSearch, SearchBox } from 'react-instantsearch-hooks-web'
import { SearchWrapper } from '.'
import { searchClient } from '.'
import SearchIcon from '../../images/svgs/search-icon.svg'
import SearchResult from './searchresults'
import styled from 'styled-components'

const SearchPageWrapper = styled.div`
    font-family: 'Montserrat', sans-serif;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font: ;
`
export default function SearchPage() {
    const queryHook = (query: string, search: any) => {
        console.log('query', query)

        if (query.length > 2) {
            search(query)
        }
    }
    return (
        <SearchPageWrapper>
            <InstantSearch searchClient={searchClient}>
                <SearchWrapper style={{ width: '100%' }}>
                    <SearchBox
                        placeholder="Search"
                        classNames={{
                            form: 'form',
                            resetIcon: 'reset',
                            submit: 'submit',
                        }}
                        submitIconComponent={() => (
                            <SearchIcon
                                style={{ maxWidth: 20, maxHeight: 20 }}
                            />
                        )}
                        resetIconComponent={() => <></>}
                        queryHook={queryHook}
                    />
                </SearchWrapper>
                <SearchResult indices={[{ name: `Pages`, title: `Pages` }]} />
            </InstantSearch>
        </SearchPageWrapper>
    )
}
