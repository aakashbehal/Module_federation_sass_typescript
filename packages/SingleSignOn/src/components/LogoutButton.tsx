import React from 'react';
import { Button } from "react-bootstrap"
import { useDispatch } from 'react-redux';
import { LoginActionCreator } from '../store/actions/auth.actions';
import { eventDispatcher } from '../routing/eventDispatcher';

const LogoutButton = () => {
    const dispatch = useDispatch()

    const logoutUser = () => {
        dispatch(LoginActionCreator.logout())
        eventDispatcher('logout')
    }

    return <Button onClick={() => logoutUser()}>Logout User</Button>
}

export default LogoutButton