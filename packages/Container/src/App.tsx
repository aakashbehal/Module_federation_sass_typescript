import React, { Suspense, lazy } from 'react';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import AuthRemoteApp from './remoteApps/AuthRemoteApp';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/index';
const RemoteAuth = lazy(() => import("singleSignOn/authApp"))


const App = () => {
    return (
        <>
            <Provider store={store}>
                <Suspense fallback={'loading...'}>
                    <Routes>
                        <Route path='/authentication/*' element={<AuthRemoteApp RemoteAuth={RemoteAuth} store={store} />} />
                        <Route path='/' element={<div>Container Application</div>} />
                    </Routes>
                </Suspense>
            </Provider>
        </>
    )
}

export default App