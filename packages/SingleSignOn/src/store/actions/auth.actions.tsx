import { AuthTypes } from "../types.d";
import { userService } from "../../services"

export const LoginActionCreator: any = {
    login: ({ username, password, type }: { username: string, password: string, type: string }) => (dispatch: any) => {
        const request = (user: any) => ({ type: AuthTypes.LOGIN_REQUEST, payload: user })
        const success = (user: any) => ({ type: AuthTypes.LOGIN_SUCCESS, payload: user })
        const failure = (user: any) => ({ type: AuthTypes.LOGIN_FAILURE, payload: user })

        dispatch(request({ username }))
        console.log(type)
        userService.login(username, password, type)
            .then(
                user => {
                    dispatch(success(user))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },

    logout: () => (dispatch: any) => {
        userService.logout()
        dispatch({ type: AuthTypes.LOGOUT })
    },

    resetUser: () => (dispatch: any) => {
        dispatch({ type: AuthTypes.LOGOUT })
    }
}