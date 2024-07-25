import 'dotenv/config';
const FacebookStrategy = require('passport-facebook').Strategy;
import passport from 'passport';
import UserClientService from '../../services/userClientService';

const configLoginWithFacebook = () => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_APP_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_APP_CALLBACK_URL,
        profileFields: ['id', 'emails', 'name', 'displayName'],
    }, async (accessToken, refreshToken, profile, callback) => {

        console.log("Profile from facebook: ");
        console.log(profile);
        const userEmail = (profile?.emails && profile?.emails.length > 0) ? profile.emails[0]?.value : profile.id;
        const rawData = {
            username: profile?.displayName,
            email: userEmail,
        }
        const user = await UserClientService.upsertUserFromSocialMedia('FACEBOOK', rawData);
        console.log("Login with facebook account, code: " + user?.code);
        return callback(null, user);
    }))
}

const handleRedirectAfterLogin = async (req, res, next) => {
    res.render('completeSignup.ejs', {
        ssoToken: req.user?.code ?? '',
    });
}

const GoogleController = {
    configLoginWithFacebook,
    handleRedirectAfterLogin,
}

module.exports = GoogleController;