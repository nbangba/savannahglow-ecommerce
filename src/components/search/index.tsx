import React, { useState } from 'react'
import algoliasearch from 'algoliasearch/lite'
import { InstantSearch, SearchBox } from 'react-instantsearch-hooks-web'
import SearchResult from './searchresults'
import styled from 'styled-components'
import SearchIcon from '../../images/svgs/search-icon.svg'
import ModalComponent from '../supportingui/modal'
import { Button } from '../layout/navbar'
export const SearchWrapper = styled.div`
    width: 90%;
    .ais-SearchBox-reset {
        display: none;
    }
    .submit {
        display: flex;
        border: none;
        align-items: center;
        border-radius: 0px 4px 4px 0px;
        cursor: pointer;
    }
    .form {
        display: flex;
        width: 100%;

        margin: 8px 0;

        border: 2px solid #35486f;
        border-radius: 4px;
        box-sizing: border-box;
        background: #f4ece6;
        font-family: 'Montserrat', sans-serif;

        font-weight: 400;
        color: #474e52;
        input {
            flex-grow: 2;
            border: none;
            padding: 8px 12px;
            background: #f4ece6;
            border-radius: 4px;
            font-size: 14px;
            &:focus {
                outline: none;
            }
        }
        &:focus-within {
            outline: none;
            border: 2px solid #35486f;
            box-shadow: 0 0 10px #9bb2e1;
        }
    }
`
const SearchBoxWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`
const searchClient = algoliasearch(
    `JPZOCGGNC8`,
    `5a6b3424004019736f1399bd006c65a5`
)

export default function Search() {
    const [open, setOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const queryHook = (query: string, search: any) => {
        console.log('query', query)

        if (query.length > 2) {
            setOpen(true)
            search(query)
        } else {
            setOpen(false)
        }
    }
    return (
        <>
            <Button
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                }}
                onClick={() => setShowModal(true)}
            >
                Search <SearchIcon style={{ width: 15, height: 15 }} />
            </Button>
            <ModalComponent
                style={{ position: 'fixed', top: 0, width: '100%' }}
                showModal={showModal}
            >
                <SearchWrapper>
                    <InstantSearch
                        searchClient={searchClient}
                        indexName="Pages"
                    >
                        <SearchBoxWrapper>
                            <SearchBox
                                style={{ flexGrow: 1 }}
                                placeholder="Search"
                                classNames={{
                                    form: 'form',
                                    resetIcon: 'reset',
                                    submit: 'submit',
                                }}
                                submitIconComponent={() => (
                                    <SearchIcon
                                        style={{
                                            maxWidth: 20,
                                            maxHeight: 20,
                                        }}
                                    />
                                )}
                                resetIconComponent={() => <></>}
                                queryHook={queryHook}
                            />
                            <Button
                                style={{ maxWidth: 'fit-content', margin: 10 }}
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </Button>
                        </SearchBoxWrapper>
                        <SearchResult
                            setShowModal={setShowModal}
                            indices={[{ name: `Pages`, title: `Pages` }]}
                        />
                    </InstantSearch>
                </SearchWrapper>
            </ModalComponent>
        </>
    )
}
