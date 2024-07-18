import passport from 'passport';
import LocalStrategy from 'passport-local';
import UserClientService from '../services/userClientService';

const configPassport = () => {
    passport.use(new LocalStrategy(async (username, password, callback) => {
        console.log(`Login with username: ${username}`);
        const rawData = {
            email: username,
            password,
        }

        const response = await UserClientService.handleLogin(rawData);
        if (response && +response.errCode === 0) {
            return callback(null, response.data);
        } else {
            return callback(null, false, { message: response?.errMsg });
        }

    }));
}

const handleLogout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
}

const PassportController = {
    configPassport,
    handleLogout,
};

module.exports = PassportController;