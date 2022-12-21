import React from 'react'
import styled,{css} from 'styled-components'
import AddresInfoProps, { AddressInfoProps } from './addressform'

interface CardProps{
 maxWidth?:string,
 minWidth?:string,
 selected?:boolean,
 selectable?:boolean,
}

export const Card = styled.div`
  position:relative;
  display:flex;
  width:100%;
  max-width:${(props:CardProps)=> props.maxWidth||'300px'};
  min-width:${(props:CardProps)=> props.minWidth||'200px'};
  border:${(props:CardProps)=>props.selected?'10px solid #f5d2a687':''};
  border-radius:0px;
  cursor:${(props:CardProps)=>props.selectable?'pointer':''};
  flex-wrap:wrap;
  margin:10px;
  padding:10px;
  background-color: #f2e3d7;
  box-sizing:border-box;
  text-overflow:ellipsis;
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);

  ${(props:CardProps)=>props.selectable && css`
  
   &:hover{
    background-color: #dccec4;
   }
  `
}

`
interface CardComponentProps{
  children:JSX.Element|JSX.Element[],
  selected?:boolean,
  setSelected?:(selected:AddressInfoProps)=> void,
  selectable?:boolean,
  addressInfo?: AddressInfoProps,
  maxWidth?:string,
  minWidth?:string,
  style?:React.CSSProperties
}
export default function CardComponent({children, selected,selectable,addressInfo,setSelected,maxWidth,minWidth,style}:CardComponentProps) {
    return (
        <Card selected={selected} minWidth={minWidth} maxWidth={maxWidth} selectable={selectable} style={{...style}}
        onClick={()=>{if(selectable&&setSelected&&addressInfo)setSelected(addressInfo)}}>
            {children}
        </Card>
          )
}
