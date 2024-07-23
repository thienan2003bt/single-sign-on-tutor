import axios from './axios';

const handleVerifyToken = async (token) => {
    const response = await axios.post(
        `${process.env.REACT_APP_SSO_BACKEND_VERIFY_TOKEN}`,
        { token }
    );
    return response;
}

const handleGetAccount = async () => {
    const response = await axios.get(
        `${process.env.REACT_APP_SSO_BACKEND_GET_ACCOUNT}`
    );

    return response;
}

const handleLogout = async () => {
    const response = await axios.post(
        `${process.env.REACT_APP_SSO_BACKEND_LOGOUT}`,
        {}
    );

    return response;
}

const UserService = {
    handleVerifyToken,
    handleGetAccount,
    handleLogout,
}

export default UserService;