import { widgetLayoutSave } from "../helpers/interface";
import { handleResponse, axiosCustom } from "../helpers/util";

const getUserWidget = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/report-service/getUserWidget`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const savePreference = async (payload: widgetLayoutSave[]) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/report-service/savePreference`, { widgets: payload })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const userWidgetList = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/report-service/userWidgetList`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const getDemoWidgets = async () => {
    try {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        };
        return fetch('/demoDashboard', requestOptions)
            .then((response) => {
                return response.text().then((text: string) => {
                    const data = text && JSON.parse(text);
                    if (!data.validation) {
                        throw Error(data.message)
                    }
                    return data;
                });
            })
            .then(data => {
                return data.response
            })
            .catch((error) => {
                throw error
            })
    } catch (error: any) {
        throw error
    }
}

const getDummyReports = async (type: any) => {
    try {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            param: {
                type
            }
        };
        return fetch('/dummyReports', requestOptions)
            .then((response) => {
                return response.text().then((text: string) => {
                    const data = text && JSON.parse(text);
                    if (!data.validation) {
                        throw Error(data.message)
                    }
                    return data;
                });
            })
            .then(data => {
                return data.response
            })
            .catch((error) => {
                throw error
            })
    } catch (error: any) {
        throw error
    }
}

export const dashboardService = {
    getUserWidget,
    getDemoWidgets,
    savePreference,
    userWidgetList,
    getDummyReports
}