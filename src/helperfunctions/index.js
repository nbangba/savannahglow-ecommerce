
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