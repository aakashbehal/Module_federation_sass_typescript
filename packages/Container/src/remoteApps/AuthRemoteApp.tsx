import React from 'react';

const AuthRemoteApp = ({ AuthApp, store }: { AuthApp: any, store: any }) => {
    return <>
        <AuthApp store={store} />
    </>
}

export default AuthRemoteApp