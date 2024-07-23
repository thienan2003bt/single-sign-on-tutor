import UserService from "../../services/user.s";

export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_FAILED = "USER_LOGIN_FAILED";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";


export const handleLogin = (SSOToken) => {
    return async (dispatch, getState) => {
        dispatch({ type: USER_LOGIN_REQUEST })
        try {
            const response = await UserService.handleVerifyToken(SSOToken);
            if (response && +response?.statusCode === 200) {
                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    user: response.data,
                })
            } else {
                dispatch({ type: USER_LOGIN_FAILED, error: response?.errMsg })
            }
        } catch (error) {
            dispatch({ type: USER_LOGIN_FAILED, error: error?.errMsg })
        }
    }
}


export const handleGetAccount = () => {
    return async (dispatch, getState) => {
        dispatch({ type: USER_LOGIN_REQUEST })
        try {
            const response = await UserService.handleGetAccount();
            if (response && +response?.statusCode === 200) {
                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    user: response.data,
                })
            } else {
                dispatch({ type: USER_LOGIN_FAILED, error: response?.errMsg })
            }
        } catch (error) {
            dispatch({ type: USER_LOGIN_FAILED, error: error?.errMsg })
        }
    }
}