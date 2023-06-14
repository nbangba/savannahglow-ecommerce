import React from 'react'
import Errorwrapper from '../errorwrapper'
import Users from './users'

export default function UserComponent() {
    return (
        <Errorwrapper>
            <Users />
        </Errorwrapper>
    )
}
