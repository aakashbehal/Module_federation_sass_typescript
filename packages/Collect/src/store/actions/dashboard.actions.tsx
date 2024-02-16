import { Dashboard, DashboardWidgetList, DashboardPreference } from "../types.d";
import { dashboardService } from "../../services"
import { widgetLayoutSave } from "../../helpers/interface";

export const DashboardActionCreator: any = {
    getUserWidget: () => (dispatch: any) => {
        const request = () => ({ type: Dashboard.DASHBOARD_REQUEST })
        const success = (widgets: any) => ({ type: Dashboard.DASHBOARD_SUCCESS, payload: widgets })
        const failure = (error: any) => ({ type: Dashboard.DASHBOARD_FAILURE, payload: error })

        dispatch(request())

        dashboardService.getUserWidget()
            .then(
                widgets => {
                    dispatch(success(widgets))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },

    userWidgetList: () => (dispatch: any) => {
        const request = () => ({ type: DashboardWidgetList.DASHBOARD_WIDGET_LIST_REQUEST })
        const success = (widgets: any) => ({ type: DashboardWidgetList.DASHBOARD_WIDGET_LIST_SUCCESS, payload: widgets })
        const failure = (error: any) => ({ type: DashboardWidgetList.DASHBOARD_WIDGET_LIST_FAILURE, payload: error })

        dispatch(request())

        dashboardService.userWidgetList()
            .then(
                widgets => {
                    dispatch(success(widgets))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },

    savePreference: (payload: widgetLayoutSave[]) => (dispatch: any) => {
        const request = () => ({ type: DashboardPreference.DASHBOARD_PREFERENCE_REQUEST })
        const success = (widgets: any) => ({ type: DashboardPreference.DASHBOARD_PREFERENCE_SUCCESS, payload: widgets })
        const failure = (error: any) => ({ type: DashboardPreference.DASHBOARD_PREFERENCE_FAILURE, payload: error })

        dispatch(request())

        dashboardService.savePreference(payload)
            .then(
                widgets => {
                    dispatch(success(widgets))
                },
                error => {
                    dispatch(failure(error))
                }
            )
            .finally(() => {
                dispatch({ type: DashboardPreference.DASHBOARD_PREFERENCE_RESET })
            })
    },

    resetGetUserWidget: () => (dispatch: any) => {
        dispatch({ type: Dashboard.DASHBOARD_RESET })
    }
}