import axios from 'axios';

let store = null;
export const injectStore = (_store) => {
    store = _store;
}

const instance = axios.create({
    withCredentials: true,
});

// instance.defaults.headers.common['Authorization'] = `Bearer ${store.getState()?.account?.userInfo?.access_token ?? 'AUTH_TOKEN'}`;

//REQUEST
instance.interceptors.request.use((config) => {
    const tokenInHeader = store.getState()?.account?.userInfo?.access_token ?? '';
    config.headers.Authorization = `Bearer ${tokenInHeader}`;
    return config;
}, (err) => {
    return Promise.reject(err);
});


//RESPONSE
instance.interceptors.response.use((response) => {
    return {
        ...response.data,
        statusCode: response.status,
    }
}, (err) => {
    const data = err?.response?.data;
    let msg = data.message;

    return data ?? Promise.reject(new Error(msg ?? ''));
});



export default instance;