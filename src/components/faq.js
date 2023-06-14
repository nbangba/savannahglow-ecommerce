import React, { useState } from 'react'
import { AccordionButton } from './settings/settings'

export default function FAQ({ data }) {
    const [activeTab, setActiveTab] = useState('')

    return data.allContentfulSgFaq.nodes.map((faq, index) => (
        <AccordionButton
            name={faq.question}
            title={faq.question}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            key={index}
        >
            <p>{faq.answer.answer}</p>
        </AccordionButton>
    ))
}
