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
    console.log("Response from server for verifying token: ");
    console.log(response);

    return response;
}

const UserService = {
    handleVerifyToken,
    handleGetAccount
}

export default UserService;