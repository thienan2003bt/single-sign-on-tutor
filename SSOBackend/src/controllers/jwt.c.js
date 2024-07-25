import UserClientService from '../services/userClientService';
import { v4 as uuidv4 } from 'uuid';
import JWTMiddleware from '../middlewares/jwt.m';

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }

    return req.query?.token;
}

const nonSecurePaths = ['/test-api', '/signup', '/login', '/logout', '/account', '/verify-services-jwt'];

const handleRegenerateRefreshToken = async (refreshToken) => {
    const user = await UserClientService.getUserByRefreshToken(refreshToken);
    if (!user) {
        return null;
    }
    const payLoadAccessToken = {
        email: user?.email,
        username: user?.username,
        groupWithRoles: user?.groupWithRoles
    }

    const newAccessToken = JWTMiddleware.signToken(payLoadAccessToken);
    const newRefreshToken = uuidv4();

    const response = await UserClientService.updateUserRefreshToken(user?.email, newRefreshToken);
    if (response && response?.status && response?.status === true) {
        return {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
        }
    }
    return null;
}

const checkUser = async (req, res, next) => {
    if (nonSecurePaths.includes(req.path) && req.path !== '/account') {
        return next();
    }
    let cookies = req.cookies;
    const tokenFromHeader = extractToken(req);

    if ((cookies && cookies?.access_token) || tokenFromHeader) {
        let token = cookies?.access_token ?? tokenFromHeader;

        try {
            let decoded = JWTMiddleware.verifyToken(token);
            if (decoded) {
                if (decoded === 'TokenExpiredError') {
                    // TODO: handle refresh token
                    if (cookies && cookies.refresh_token) {
                        const newTokens = await handleRegenerateRefreshToken(cookies.refresh_token);
                        if (!newTokens || !newTokens?.access_token || !newTokens?.refresh_token) {
                            throw new Error("Error updating refresh token for user !");
                        }
                        const { access_token, refresh_token } = newTokens;

                        res.cookie('access_token', access_token, {
                            maxAge: +process.env.MAX_AGE_ACCESS_TOKEN,
                            httpOnly: true,
                            domain: process.env.COOKIE_DOMAIN,
                            path: '/',
                        })
                        res.cookie('refresh_token', refresh_token, {
                            maxAge: +process.env.MAX_AGE_REFRESH_TOKEN,
                            httpOnly: true,
                            domain: process.env.COOKIE_DOMAIN,
                            path: '/',
                        });

                        return res.status(405).json({
                            errCode: '-2',
                            errMsg: 'Unauthenticated user',
                            data: null,
                        })
                    } else {
                        return res.status(401).json({
                            errCode: '-2',
                            errMsg: 'Unauthenticated user',
                            data: null,
                        })
                    }
                } else {
                    req.user = {
                        ...decoded,
                        access_token: cookies?.access_token,
                        refresh_token: cookies?.refresh_token,
                    };
                }
                return next();
            } else {
                return res.status(401).json({
                    errCode: '-2',
                    errMsg: 'Unauthenticated user',
                    data: null,
                })
            }
        } catch (error) {
            console.log('Service error: ở đây chứ gì :>>' + error.message);
            return res.status(500).json({
                errCode: '-2',
                errMsg: 'Service error: ở đây chứ gì :>>' + error.message,
                data: null,
            });
        }
    } else {
        return res.status(401).json({
            errCode: '-3',
            errMsg: 'Unauthenticated user',
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

const checkServiceJWT = (req, res, next) => {
    const tokenFromHeader = extractToken(req);

    if (tokenFromHeader) {
        let token = tokenFromHeader;

        try {
            let decoded = JWTMiddleware.verifyToken(token);
            // TODO: refresh_token

            if (decoded) {
                return res.status(200).json({
                    errCode: '0',
                    errMsg: 'Verify user for service successfully',
                    data: true,
                });
            } else {
                return res.status(401).json({
                    errCode: '-2',
                    errMsg: 'Unauthenticated user',
                    data: null,
                })
            }
        } catch (error) {
            console.log('Service error: ' + error.message);
            return res.status(500).json({
                errCode: '-2',
                errMsg: 'Service error: ' + error.message,
                data: null,
            })
        }
    } else {
        return res.status(400).json({
            errCode: '-2',
            errMsg: 'Not provide authorization token in headers',
            data: null,
        })
    }
}


const JWTController = {
    checkUser,
    checkUserPermission,
    checkServiceJWT,
}

module.exports = JWTController;