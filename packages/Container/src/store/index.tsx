import { combineReducers, legacy_createStore as createStore, compose, applyMiddleware } from 'redux'
import thunk from "redux-thunk";

const middleware = [thunk];

const initialState = {
    appName: 'host'
}

const hostReducer = (state: any = initialState, action: any) => {
    switch (action.type) {
        default:
            return state
    }
}

const staticReducers = {
    host: hostReducer
}

export default function configureStore(initialState?: { appName: string }) {

    const store: any = createStore(createReducer(), compose(
        applyMiddleware(...middleware),
        ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
            (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
        compose
    ))

    store.asyncReducers = {}

    store.injectReducer = (key: string, asyncReducer: any) => {
        store.asyncReducers[key] = asyncReducer
        store.replaceReducer(createReducer(store.asyncReducers))
    }

    return store
}

function createReducer(asyncReducer?: any) {
    return combineReducers({
        ...staticReducers,
        ...asyncReducer
    })
}

export const store = configureStore()