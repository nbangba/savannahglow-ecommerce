import React from 'react'
import styled from 'styled-components'

const Card = styled.div`
  position:relative;
  display:flex;
  width:100%;
  max-width:${props=> props.maxWidth||'300px'};
  min-width:${props=> props.maxWidth||'200px'};
  border-radius:0px;
  flex-wrap:wrap;
  margin:10px;
  padding:10px;
  background-color: #f2e3d7;
  box-sizing:border-box;
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
`
export default function CardComponent({children}) {
    return (
        <Card>
            {children}
        </Card>
    )
}
