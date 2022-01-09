import React from 'react'
import Select from 'react-select';


export default function QueryOptions({orderStatus,setOrderStatus,setStartDate}) {
    const options1 = [
        { value: 'all', label: 'All' },
        { value: 'received', label: 'Received' },
        { value: 'delivered', label: 'Delivered' },
        {value:'cancelled',label:'Cancelled'}
      ]
      const options2 = [
        { value: 0, label: 'All' },
        { value: 86400000, label: 'Past 24hrs' },
        { value: 604000000, label: 'Past Week' },
        {value:31540000000,label:'Past Year'}
      ]
    return (
        <div>
            <Select options={options2}/>
            <Select options={options1} defaultValue={options1[0]} onChange={(value)=>setOrderStatus(value.value)}/>
        </div>
    )
}
