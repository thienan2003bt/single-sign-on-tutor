import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_FAILED,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT_REQUEST,
    USER_LOGOUT_FAILED,
    USER_LOGOUT_SUCCESS,
} from '../action/accountAction';

const INITIAL_STATE = {
    userInfo: {
        username: '',
        email: '',
        access_token: '',
        refresh_token: '',
    },
    isLoading: false,
    message: '',
};

const accountReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST: return {
            ...state,
            isLoading: true,
            message: '',
        };

        case USER_LOGIN_FAILED: return {
            ...state,
            isLoading: false,
            message: action?.error,
        };

        case USER_LOGIN_SUCCESS: return {
            ...state,
            userInfo: action?.user,
            isLoading: false,
            message: '',
        };


        case USER_LOGOUT_REQUEST: return {
            ...state,
            isLoading: true,
            message: '',
        };

        case USER_LOGOUT_FAILED: return {
            ...state,
            isLoading: false,
            message: action?.error,
        };

        case USER_LOGOUT_SUCCESS: return {
            ...state,
            userInfo: {
                username: '',
                email: '',
                access_token: '',
                refresh_token: '',
            },
            isLoading: false,
            message: '',
        };

        default: return state;
    }
}

export default accountReducer;