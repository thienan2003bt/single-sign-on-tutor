import jwt from 'jsonwebtoken';
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;
const expiresIn = process.env.JWT_EXPIRATION;

const verifyToken = (token) => {
    let data = null;

    try {
        let decoded = jwt.verify(token, secretKey);
        data = decoded;
    } catch (error) {
        console.log("JWT verifing error: " + error.message);
    }

    return data;
}

const signJWTSample = () => {
    let payload = {
        foo: 'bar',
    };

    let token = '';
    try {
        token = jwt.sign(payload, secretKey, { expiresIn: expiresIn });
    } catch (error) {
        console.log("JWT signing error: " + error.message);
    }

    return token;
}

const signToken = (payload) => {
    let token = '';
    try {
        token = jwt.sign(payload, secretKey, { expiresIn: expiresIn });
    } catch (error) {
        console.log("JWT signing error: " + error.message);
    }

    return token;
}

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }

    return req.query?.token;
}


const nonSecurePaths = ['/test-api', '/signup', '/login', '/logout', '/account'];

const checkUser = (req, res, next) => {
    if (nonSecurePaths.includes(req.path) && req.path !== '/account') {
        return next();
    }
    let cookies = req.cookies;
    const tokenFromHeader = extractToken(req);

    if ((cookies && cookies?.access_token) || tokenFromHeader) {
        let token = cookies?.access_token ?? tokenFromHeader;

        try {
            let decoded = verifyToken(token);
            if (decoded) {
                req.user = {
                    ...decoded,
                    access_token: cookies?.access_token,
                    refresh_token: cookies?.refresh_token,
                };
                return next();
            } else {
                return res.status(401).json({
                    errCode: '-2',
                    errMsg: 'Unauthenticated user',
                    data: null,
                })
            }
        } catch (error) {
            return res.status(500).json({
                errCode: '-2',
                errMsg: 'Service error: ' + error.message,
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
            //console.log(`Current URL: ${currentURL} versus item: ${item.url}`);
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
    verifyToken,
    signJWTSample,
    signToken,
    checkUser,
    checkUserPermission,
}


module.exports = JWTMiddleware;