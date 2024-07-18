import passport from 'passport';
import LocalStrategy from 'passport-local';
import UserClientService from '../services/userClientService';

const configPassport = () => {
    passport.use(new LocalStrategy(async (username, password, callback) => {
        console.log(`Check username: ${username} and password: ${password}`);
        const rawData = {
            email: username,
            password,
        }

        const response = await UserClientService.handleLogin(rawData);
        console.log("!!! Response: ");
        console.log(response);
        if (response && +response.errCode === 0) {
            return callback(null, response.data);
        } else {
            return callback(null, false, { message: response?.errMsg });
        }

    }));
}


const PassportController = {
    configPassport,
};

module.exports = PassportController;