import React,{useState} from 'react'
import { AccordionButton } from './settings'
export default function FAQ({data}) {
    const [active,setActive] = useState(null)
  return (
    data.allContentfulSgFaq.nodes.map((faq,index)=>
      <AccordionButton name={index} title={faq.question} active={active} setActive={setActive}>
          <p>{faq.answer.answer}</p>
      </AccordionButton>
    
    )
  )
}
