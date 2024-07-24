const GoogleStrategy = require('passport-google-oauth20').Strategy;
import 'dotenv/config';
import passport from 'passport';
import UserClientService from '../../services/userClientService';
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

        return callback(null, user);

    }))
}

const GoogleController = {
    configLoginWithGoogle
}

module.exports = GoogleController;