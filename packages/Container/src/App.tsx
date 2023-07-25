import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom'
import LoginRemoteApp from './remoteApps/login';
const RemoteLogin = lazy(() => import("singleSignOn/loginApp"))

const App = () => {
    return (
        <>
            <Suspense fallback={'loading...'}>
                <Routes>
                    <Route path='/login' element={<LoginRemoteApp LoginApp={RemoteLogin} />} />
                </Routes>
            </Suspense>
        </>
    )
}

export default App