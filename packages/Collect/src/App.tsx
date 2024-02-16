import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import reducer from './store/reducer';

export const remoteAppScope = 'collect'

const App = ({ router, store }: any) => {

    useEffect(() => {
        store.injectReducer(remoteAppScope, reducer)
    }, [])

    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default App