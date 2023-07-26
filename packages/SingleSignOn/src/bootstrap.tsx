import React, { useEffect } from 'react';
import './index.sass'
// import { ToastProvider } from 'react-toast-notifications';
// import { MyCustomToast } from './helpers/customToaster';
import { Provider } from 'react-redux';
import reducer from './store/reducer';
export const remoteAppScope = 'singleSignOn'
import { httpInterceptor } from './helpers/util';
import App from './App';


httpInterceptor()

const remoteLoginApp = (props: { store: any }) => {
    let { store } = props;

    useEffect(() => {
        store.injectReducer(remoteAppScope, reducer)
    }, [])

    return (
        // <ToastProvider components={{ Toast: MyCustomToast }} placement="top-center" autoDismissTimeout={10000} >
        <Provider store={store || {}}>
            <App />
        </Provider>
        // </ToastProvider >
    )
}

export default remoteLoginApp