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
        if (error instanceof jwt.TokenExpiredError) {
            console.log("Token expired !");
            return 'TokenExpiredError';
        }
        console.log("JWT verifying error: " + error.message);
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


const JWTMiddleware = {
    verifyToken,
    signJWTSample,
    signToken,
}


module.exports = JWTMiddleware;