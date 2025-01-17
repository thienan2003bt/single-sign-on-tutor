import UserClientService from '../services/userClientService';
import 'dotenv/config';

const getTestAPI = (req, res, next) => {
    try {
        res.status(200).json({
            message: 'ok',
            data: 'test api data returned successfully'
        });
    } catch (error) {
        next(error);
    }
}

const postSignup = async (req, res, next) => {
    try {

        if (!req.body?.email || !req.body?.username || !req.body?.phone || !req.body?.password) {
            return res.json({
                errCode: '-1',
                errMsg: 'Missing required parameters',
                data: ''
            });
        }


        let newUser = await UserClientService.createNewUser(req.body);


        return res.status(200).json({
            errCode: newUser.errCode,
            errMsg: newUser.errMsg,
            data: newUser.data
        });
    } catch (error) {
        next(error);
    }
}

const postLogin = async (req, res, next) => {
    try {
        if (!req.body?.email || !req.body?.password) {
            return res.json({
                errCode: '-1',
                errMsg: 'Missing required parameters',
                data: ''
            });
        }

        let newUser = await UserClientService.handleLogin(req.body);

        if (newUser && newUser.data && newUser.data.accessToken) {
            res.cookie("access_token", newUser.data?.accessToken, {
                maxAge: +process.env.MAX_AGE_ACCESS_TOKEN,
                httpOnly: true,
                domain: process.env.COOKIE_DOMAIN,
                path: '/',
            });
        }
        return res.status(200).json({
            errCode: newUser.errCode,
            errMsg: newUser.errMsg,
            data: newUser.data
        });
    } catch (error) {
        next(error);
    }
}

const postLogout = (req, res, next) => {
    try {
        res.clearCookie('access_token', { domain: process.env.COOKIE_DOMAIN, path: '/' });
        res.clearCookie('refresh_token', { domain: process.env.COOKIE_DOMAIN, path: '/' });
        return res.status(200).json({
            errCode: '0',
            errMsg: "Logout successfully",
            data: null
        });
    } catch (error) {
        return res.status(500).json({
            errCode: '-2',
            errMsg: 'Error logging out account ...',
            data: null,
        });
    }
}

module.exports = {
    getTestAPI,
    postSignup,
    postLogin,
    postLogout,
};