const GoogleStrategy = require('passport-google-oauth20').Strategy;
import 'dotenv/config';
import passport from 'passport';
import UserClientService from '../../services/userClientService';
import { v4 as uuidv4 } from 'uuid';

const configLoginWithGoogle = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_APP_CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, callback) => {
        const rawData = {
            username: profile?.displayName,
            email: profile?.emails[0]?.value ?? '',
            googleID: profile.id,
        }
        const user = await UserClientService.upsertUserFromSocialMedia('GOOGLE', rawData);
        console.log("Login with google account, code: " + user.code);
        return callback(null, user);
    }))
}

const handleRedirectAfterLogin = async (req, res, next) => {
    res.render('completeSignup.ejs', {
        ssoToken: req.user?.code ?? '',
    });
}

const GoogleController = {
    configLoginWithGoogle,
    handleRedirectAfterLogin,
}

module.exports = GoogleController;