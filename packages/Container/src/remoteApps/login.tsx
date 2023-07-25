import React from 'react';

const LoginRemoteApp = ({ LoginApp }: { LoginApp: React.LazyExoticComponent<React.ComponentType<{}>> }) => {
    return <>
        <LoginApp />
    </>
}

export default LoginRemoteApp