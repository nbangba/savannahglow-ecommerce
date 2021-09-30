import React from 'react'
import styled,{css} from 'styled-components'

export const Card = styled.div`
  position:relative;
  display:flex;
  width:100%;
  max-width:${props=> props.maxWidth||'300px'};
  min-width:${props=> props.maxWidth||'200px'};
  border:${props=>props.selected?'10px solid #f5d2a687':''};
  border-radius:0px;
  cursor:${props=>props.selectable?'pointer':''};
  flex-wrap:wrap;
  margin:10px;
  padding:10px;
  background-color: #f2e3d7;
  box-sizing:border-box;
  text-overflow:ellipsis;
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
 
  ${props=>props.selectable && css`
  
   &:hover{
    background-color: #dccec4;
   }
  `
}

`
export default function CardComponent({children, selected,selectable,addressInfo,setSelected,maxWidth}) {
    return (
        <Card selected={selected} maxWidth={maxWidth} selectable={selectable} onClick={()=>{if(selectable)setSelected(addressInfo)}}>
            {children}
        </Card>
    )
}
