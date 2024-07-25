import express from 'express';
import UserMiddleware from '../middlewares/user.m';

const router = express.Router();
import passport from 'passport';
import HomeController from '../controllers/home.c';
import LoginController from '../controllers/login.c';
import PassportController from '../controllers/passport.c';
import GoogleController from '../controllers/social/google.c';
import FacebookController from '../controllers/social/facebook.c';
import OTPCodeController from '../controllers/otpCode.c';

/**
 * 
 * @param {*} app - express app
 */
const initWebRoutes = (app) => {
    //GET
    router.get('/', UserMiddleware.isLogin, HomeController.renderHome);
    router.get('/user', HomeController.renderUserPage);
    router.get('/user/update/:id', HomeController.renderUpdateUserPage);
    router.get('/login', UserMiddleware.isLogin, LoginController.renderLoginPage);
    router.get('/forgot-password', LoginController.renderForgotPasswordPage)

    router.get('/auth/google', passport.authenticate(
        'google',
        { scope: ['profile', 'email'] }
    ));
    router.get('/google/redirect', passport.authenticate('google', {
        failureRedirect: '/login',
    }), GoogleController.handleRedirectAfterLogin);

    router.get('/auth/facebook', passport.authenticate('facebook',
        { scope: ['email'] }
    ));
    router.get('/facebook/redirect', passport.authenticate('facebook', {
        failureRedirect: '/login',
    }), FacebookController.handleRedirectAfterLogin);

    //POST
    router.post('/user/create', HomeController.insertNewUser)
    router.post('/user/delete/:id', HomeController.deleteUser);
    router.post('/user/update/:id', HomeController.updateUser);
    router.post('/login', LoginController.handleLogin);
    router.post('/logout', PassportController.handleLogout);
    router.post('/verify_token', LoginController.verifySSOToken);
    router.post('/send-code', OTPCodeController.handleSendCode)
    return app.use('/', router);
}

export default initWebRoutes;