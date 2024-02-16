import React, { useEffect } from 'react';
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';

import { createRouter } from './routing/router-factory';
import { RoutingStrategy } from './routing/types';
import './index.sass'
import App from './App';
import { ToastProvider } from 'react-toast-notifications';
import { MyCustomToast } from './helpers/customToaster';
import { httpInterceptor } from './helpers/util';

httpInterceptor()

const mount = ({
    store,
    mountPoint,
    initialPathname,
    routingStrategy
}: {
    store: any,
    mountPoint: HTMLElement;
    initialPathname?: string;
    routingStrategy?: RoutingStrategy;
}) => {

    const router = createRouter({ strategy: routingStrategy, initialPathname });
    const root = createRoot(mountPoint);

    root.render(
        <ToastProvider components={{ Toast: MyCustomToast }} placement="top-center" autoDismissTimeout={10000}>
            <Provider store={store || {}}>
                <App router={router} store={store} />
            </Provider>
        </ToastProvider>
    )

    return () => queueMicrotask(() => root.unmount());
}

export { mount }