import React from 'react';
import { Outlet } from "react-router-dom";
import { NavigationManager } from "../components/NavigationManager";
import Login from '../components/Login';
import Registration from '../components/Registration';
import ForgotPassword from '../components/ForgotPass';
import ChangePassword from '../components/ChangePassword';
import SetPassword from '../components/SetPassword';
import Activate from '../components/Activate';

export const routes = [
    {
        path: "/",
        element: (
            <NavigationManager>
                <Outlet />
            </NavigationManager>
        ),
        children: [
            {
                index: true,
                path: 'login',
                element: <Login />,
            },
            {
                path: "registration",
                element: <Registration />,
            },
            {
                path: "forgot_password",
                element: <ForgotPassword />,
            },
            {
                path: "change_password",
                element: <ChangePassword />,
            },
            {
                path: "set_password",
                element: <SetPassword />,
            },
            {
                path: "activate",
                element: <Activate />,
            },
            {
                path: '*',
                element: <div>Check with routing</div>
            }
        ],
    },
];