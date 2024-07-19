import passport from 'passport';
import LocalStrategy from 'passport-local';
import UserClientService from '../services/userClientService';

const configPassport = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    }, async (req, email, password, callback) => {
        console.log(`Login with email: ${email}`);
        const rawData = {
            email,
            password,
        }

        const response = await UserClientService.handleLogin(rawData);
        if (response && +response.errCode === 0) {
            return callback(null, response.data);
        } else {
            return callback(null, false, req.flash('message', response?.errMsg ?? ''));
            // return callback(null, false, { message: response?.errMsg ?? '' });
        }

    }));
}

const handleLogout = (req, res, next) => {
    const loggingOutUser = req.user?.email;
    req.logOut((err) => {
        if (err) {
            console.log(`Error logging out user with email: ${loggingOutUser}.\nErr:  ${err?.message ?? err}`);
            return next(err);
        }

        console.log(`Log out user with email: ${loggingOutUser}`);
        res.redirect('/login');
    });
}

const PassportController = {
    configPassport,
    handleLogout,
};

module.exports = PassportController;