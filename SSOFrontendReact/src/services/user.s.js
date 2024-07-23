import axios from './axios';

const handleVerifyToken = async (token) => {
    const response = await axios.post(
        `${process.env.REACT_APP_SSO_BACKEND_VERIFY_TOKEN}`,
        { token }
    );


    console.log("Response from server for verifying token: ");
    console.log(response);

    return response;
}

const UserService = {
    handleVerifyToken
}

export default UserService;