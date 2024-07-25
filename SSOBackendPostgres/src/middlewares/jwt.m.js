import 'dotenv/config';
import axios from 'axios';

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }

    return req.query?.token;
}

const nonSecurePaths = ['/', '/signup', '/login', '/logout', '/account'];

const checkUser = async (req, res, next) => {
    if (nonSecurePaths.includes(req.path) && req.path !== '/account') {
        return next();
    }
    const tokenFromHeader = extractToken(req);

    if (tokenFromHeader) {
        let token = tokenFromHeader;

        try {
            const response = await axios.get(process.env.API_SSO_VERIFY_ACCESS_TOKEN, {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });

            if (response && response?.data && response?.data?.data === true) {
                return next();
            } else {
                throw new Error(response?.errMsg ?? '');
            }
        } catch (error) {
            console.log("Error checking access token: " + error);
            return res.status(500).json({
                errCode: '-2',
                errMsg: 'Service user error: ' + error.message,
                data: null,
            })
        }
    } else {
        return res.status(400).json({
            errCode: '-3',
            errMsg: 'Not provide authorization token in headers',
            data: null,
        })
    }
}

const checkUserPermission = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) {
        return next();
    }
    if (req.user) {
        let { group_role_list } = req.user;

        let roleList = group_role_list.Roles;
        if (!roleList && roleList.length <= 0) {
            return res.status(403).json({
                errCode: '-3',
                errMsg: 'You do not have permission to access this resource',
                data: null,
            })
        }
        let currentURL = req.path;

        let matchURL = roleList.some(item => {
            let state = item.url === currentURL;
            return state;
        });
        if (matchURL) {
            return next();
        } else {
            return res.status(403).json({
                errCode: '-2',
                errMsg: 'You do not have permission to access this resource',
                data: null,
            })
        }

    } else {
        return res.status(401).json({
            errCode: '-3',
            errMsg: 'Unauthenticated user',
            data: null,
        })
    }
}

const JWTMiddleware = {
    checkUser,
    checkUserPermission,
}

module.exports = JWTMiddleware;