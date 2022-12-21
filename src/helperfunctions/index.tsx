import { VarietyProps } from "../components/product"

export function leadingZeros(numOfZeros:number,number:number){
    let newString = number+''
    while(newString.length < numOfZeros)
     newString = '0'+newString

  return newString   
}

export const calculateSubTotal = (items:VarietyProps[])=>{
  const reducer =(previousItem:number,currentItem:VarietyProps)=> previousItem + (currentItem.price*currentItem.quantity)
return items.reduce(reducer,0)
}

export const calculateDiscountedSubTotal = (items:VarietyProps[])=>{
 const reducer =(previousItem:number,currentItem:VarietyProps)=> {
    if(currentItem.discount)
      return (previousItem + ((currentItem.price-currentItem.discount)*currentItem.quantity))
    else
      return (previousItem + (currentItem.price*currentItem.quantity))
    }
 return items.reduce(reducer,0)
}

export const calculateTotalDiscount = (items:VarietyProps[])=>{
  console.log(items)
  const reducer =(previousItem:number,currentItem:VarietyProps)=> {
    if(currentItem.discount)
      return (previousItem + (currentItem.discount*currentItem.quantity))
    else
      return (previousItem)
    }
 return items.reduce(reducer,0)
}