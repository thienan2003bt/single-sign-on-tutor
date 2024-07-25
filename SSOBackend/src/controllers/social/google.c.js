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
        const userEmail = (profile?.emails && profile?.emails.length > 0) ? profile.emails[0]?.value : profile.id;
        const rawData = {
            username: profile?.displayName,
            email: userEmail,
        }
        const user = await UserClientService.upsertUserFromSocialMedia('GOOGLE', rawData);
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