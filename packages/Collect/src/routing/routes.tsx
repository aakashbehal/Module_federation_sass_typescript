import React from 'react';
import { Outlet } from "react-router-dom";
import { NavigationManager } from "../components/NavigationManager";
import Dashboard from '../containers/Dashboard/Dashboard';

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
                path: 'Dashboard',
                element: <Dashboard />,
            },
            {
                path: '*',
                element: <div>Check with routing</div>
            }
        ],
    },
];