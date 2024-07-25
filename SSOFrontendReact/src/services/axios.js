import axios from 'axios';

const instance = axios.create({
    withCredentials: true,
});

// Un-comment this in case you want to pass cookies to the server through req.headers
// instance.defaults.headers.common['Authorization'] = `Bearer ` + localStorage.getItem('accessToken');

//REQUEST
instance.interceptors.request.use((config) => {
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