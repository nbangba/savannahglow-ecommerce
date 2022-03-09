
export function leadingZeros(numOfZeros,number){
    let newString = number+''
    while(newString.length < numOfZeros)
     newString = '0'+newString

  return newString   
}

export const calculateSubTotal = (items)=>{
  const reducer =(previousItem,currentItem)=> previousItem + (currentItem.price*currentItem.quantity)
return items.reduce(reducer,0)
}

export const calculateDiscountedSubTotal = (items)=>{
 const reducer =(previousItem,currentItem)=> {
    if(currentItem.discount)
      return (previousItem + ((currentItem.price-currentItem.discount)*currentItem.quantity).toFixed(2))
    else
      return (previousItem + (currentItem.price*currentItem.quantity)).toFixed(2)
    }
 return items.reduce(reducer,0)
}

export const calculateTotalDiscount = (items)=>{
  console.log(items)
  const reducer =(previousItem,currentItem)=> {
    if(currentItem.discount)
      return (previousItem + (currentItem.discount*currentItem.quantity).toFixed(2))
    else
      return (previousItem).toFixed(2)
    }
 return items.reduce(reducer,0)
}