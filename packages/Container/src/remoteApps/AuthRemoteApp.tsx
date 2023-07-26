import React from 'react';

const AuthRemoteApp = ({ RemoteAuth, store }: { RemoteAuth: any, store: any }) => {
    return <>
        <RemoteAuth store={store} />
    </>
}

export default AuthRemoteApp