import axios from 'axios';
import axiosRetry from 'axios-retry';

let store = null;
export const injectStore = (_store) => {
    store = _store;
}

const instance = axios.create({
    withCredentials: true,
});

axiosRetry(instance, {
    retries: 3,
    retryCondition: (error) => {
        if (error?.response?.status === 400 || error?.response?.status === 405) {
            return true;
        }
    },
    retryDelay: (retryCount, error) => {
        return retryCount * 100;//100 milliseconds
    }
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