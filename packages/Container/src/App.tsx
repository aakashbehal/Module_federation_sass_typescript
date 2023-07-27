import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, HashRouter, Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux';

import { store } from './store/index';
import AuthRemoteApp from './remoteApps/AuthRemoteApp';
import DocumentRemoteApp from './remoteApps/documentRemoteApp';

const AuthApp = lazy(() => import("singleSignOn/authApp"))
const DocumentApp = lazy(() => import("documentManager/documentApp"))



const App = () => {
    return (
        <>
            <Provider store={store}>
                <Suspense fallback={'loading...'}>
                    <Routes>
                        <Route path='/authentication/*' element={<AuthRemoteApp AuthApp={AuthApp} store={store} />} />
                        <Route path='/document_manager/*' element={<DocumentRemoteApp DocumentApp={DocumentApp} store={store} />} />
                        <Route
                            path="/"
                            element={<Navigate replace to="/authentication/login" />}
                        />
                    </Routes>
                </Suspense>
            </Provider>
        </>
    )
}

export default App