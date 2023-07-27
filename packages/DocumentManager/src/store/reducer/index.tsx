import { combineReducers } from "redux";

import authReducer from "./auth.reducer";
import miscReducer from "./common/misc.reducer";
import typesReducer from "./common/types.reducer";
import registrationReducer from "./registration.reducer";

const appReducer = combineReducers({
    auth: authReducer,
    misc: miscReducer,
    types: typesReducer,
    registration: registrationReducer,
})

export default appReducer