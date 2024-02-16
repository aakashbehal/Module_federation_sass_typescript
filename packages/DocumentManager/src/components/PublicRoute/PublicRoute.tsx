
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { userService } from 'singleSignOn/UserService'

const PublicRoute = ({ component: Component, ...rest }: any) => {
    return (
        <Route {...rest} render={(props: any) => (
            userService.isLoggedIn() ?
                <Navigate to="/documents/my_documents" />
                : <Component {...props} />
        )} />
    );
};

export default PublicRoute;