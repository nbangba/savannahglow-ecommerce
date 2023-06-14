import React from 'react'
import Select, { SingleValue } from 'react-select';

interface QueryOptionsProps{
  setOrderStatus: (value:string|null)=>void,
  setOrderDate: (value:Date|null)=>void,
}

export default function QueryOptions({setOrderStatus,setOrderDate}:QueryOptionsProps) {
    const options1 = [
        { value: 'all', label: 'All' },
        { value: 'received', label: 'Received' },
        { value: 'delivered', label: 'Delivered' },
        {value:'cancelled',label:'Cancelled'}
      ]
      const options2 = [
        { value:new Date(new Date().getTime() - new Date().getTime()) , label: 'All time' },
        { value:new Date(new Date().getTime() - 86400000), label: 'Past 24hrs' },
        { value:new Date(new Date().getTime() - 604000000), label: 'Past Week' },
        {value:new Date(new Date().getTime() - 31540000000),label:'Past Year'}
      ]

    return (
        <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',fontFamily:'Montserrat'}}>
            <Select options={options2} 
            onChange={(value)=>setOrderDate(value?value.value:null)} defaultValue={options2[0]}
            styles={{container: base => ({
              ...base,
              flex: '1 1 ',
              maxWidth:200,
              margin:10
            })}} />
            <Select options={options1} defaultValue={options1[0]} onChange={(value)=>setOrderStatus(value?value.value:null)}
            styles={{container: base => ({
              ...base,
              flex: '1 1 ',
              maxWidth:200,
              margin:10
            })}}/>
        </div>
    )
}
