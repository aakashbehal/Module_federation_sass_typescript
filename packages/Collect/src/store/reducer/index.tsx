import { combineReducers } from "redux";

import miscReducer from "./common/misc.reducer";
import typesReducer from "./common/types.reducer";
import dashboardReducer from "./dashboard.reducer";

const appReducer = combineReducers({
    misc: miscReducer,
    types: typesReducer,
    dashboard: dashboardReducer,
})

export default appReducer