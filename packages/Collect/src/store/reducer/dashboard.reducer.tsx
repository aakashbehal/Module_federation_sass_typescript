import { Dashboard, DashboardWidgetList, DashboardPreference } from "../types.d";

const initialState = {
    data: [],
    theme: '',
    loading: false,
    error: false,
    widgetList: {},
    loadingWidgetList: false,
    successWidgetList: false,
    errorWidgetList: false,
    savingPreference: false,
    errorPreference: false,
    successPreference: false
}

const dashboardReducer = (state = initialState, action: { type: any; payload: any }) => {
    switch (action.type) {
        case Dashboard.DASHBOARD_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case Dashboard.DASHBOARD_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.preference,
                theme: action.payload.theme
            }
        case Dashboard.DASHBOARD_FAILURE:
            return {
                ...state,
                loading: false,
                data: [],
                error: true
            }
        case Dashboard.DASHBOARD_RESET:
            return {
                ...state,
                data: [],
                theme: '',
                error: false
            }
        case DashboardWidgetList.DASHBOARD_WIDGET_LIST_REQUEST:
            return {
                ...state,
                loadingWidgetList: true,
                successWidgetList: false,
                errorWidgetList: false
            }
        case DashboardWidgetList.DASHBOARD_WIDGET_LIST_SUCCESS:
            return {
                ...state,
                loadingWidgetList: false,
                widgetList: action.payload,
                successWidgetList: true
            }
        case DashboardWidgetList.DASHBOARD_WIDGET_LIST_FAILURE:
            return {
                ...state,
                loadingWidgetList: false,
                errorWidgetList: true
            }
        case DashboardWidgetList.DASHBOARD_WIDGET_LIST_RESET:
            return {
                ...state,
                loadingWidgetList: false,
                successWidgetList: false,
                errorWidgetList: false
            }
        case DashboardPreference.DASHBOARD_PREFERENCE_REQUEST:
            return {
                ...state,
                savingPreference: true,
                errorPreference: false,
                successPreference: false
            }
        case DashboardPreference.DASHBOARD_PREFERENCE_SUCCESS:
            return {
                ...state,
                savingPreference: false,
                successPreference: true
            }
        case DashboardPreference.DASHBOARD_PREFERENCE_FAILURE:
            return {
                ...state,
                loadingWidgetList: false,
                errorPreference: true
            }
        case DashboardPreference.DASHBOARD_PREFERENCE_RESET:
            return {
                ...state,
                savingPreference: false,
                errorPreference: false,
                successPreference: false
            }
        default:
            return state
    }
}

export default dashboardReducer;