import { userService, commonServices } from "../services";
import axios, { AxiosInstance } from "axios";
import React, { useEffect, useMemo, useState } from "react";
// import { history } from "./history";

export const axiosCustom: any = axios.create(); // export this and use it in all your components
axiosCustom.isCancel = axios.isCancel


export const encryptPassword: any = (password: any) => {
    return password
}

export const handleResponse = (response: any) => {
    if (!response.data.validation) {
        if (response.data.message === 'Token Expired!') {
            userService.logoutAuthExpired()
        }
        throw response.data.message
    }
    return response.data;
}


export const httpInterceptor = () => {
    const noAuthRequired = [
        "login",
        "authenticate",
        "logout"
    ]
    axiosCustom.interceptors.request.use(
        (request: any) => {
            try {
                let user = userService.getUser();
                let token = userService.getAccessToken()
                if (request.url.includes('changePasswordByUserDetails')) {
                    user = userService.getTempUser()
                }
                const url = request.url.split('/')
                const urlString = url[url.length - 1].split('?')
                if (token === null && urlString[0] === 'logout') {
                    localStorage.removeItem('user');
                    // history.push('/login')
                }
                if (
                    noAuthRequired.indexOf(urlString[0]) === -1
                ) {
                    request.headers['Authorization'] = `Bearer ${token}`;
                    if (user?.apiKey) {
                        request.headers['X-API-KEY'] = user.apiKey
                    }
                }
                request.headers['rqsOrigin'] = 'web';
                return request
            } catch (err) {
                return Promise.reject(err)
            }
        },
        (error: any) => {
            if (axiosCustom.isCancel(error)) {
                return console.log(error);
            }
            return Promise.reject(error.response)
        }
    )
}


export const passwordRegexCheck = (password: any) => {
    const passRegex = /^((?=.*?[A-Z])(?=.*?[a-z])(?=.*[^A-Za-z0-9\s])|(?=.*?[0-9])(?=.*?[a-z])(?=.*[^A-Za-z0-9\s])|(?=.*?[0-9])(?=.*?[A-Z])(?=.*[^A-Za-z0-9\s])|(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z]))(?=.{14,})/
    return passRegex.test(password)
}
