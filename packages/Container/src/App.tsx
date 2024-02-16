import React, { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';

import { store } from './store/index';
import { Router } from './routing/Router';

const App = () => {

    return (
        <>
            <Provider store={store}>
                <Suspense fallback={'loading...'}>
                    <Router />
                </Suspense>
            </Provider>
        </>
    )
}

export default App