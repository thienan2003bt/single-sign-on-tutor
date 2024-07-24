import express from 'express';
import UserMiddleware from '../middlewares/user.m';

const router = express.Router();
import passport from 'passport';
import HomeController from '../controllers/home.c';
import LoginController from '../controllers/login.c';
import PassportController from '../controllers/passport.c';
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
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get('/google/redirect', passport.authenticate(
        'google',
        { failureRedirect: '/login' }
    ), (req, res, next) => {
        res.redirect('/');
    })

    //POST
    router.post('/user/create', HomeController.insertNewUser)
    router.post('/user/delete/:id', HomeController.deleteUser);
    router.post('/user/update/:id', HomeController.updateUser);
    router.post('/login', LoginController.handleLogin);
    router.post('/logout', PassportController.handleLogout);
    router.post('/verify_token', LoginController.verifySSOToken);

    return app.use('/', router);
}

export default initWebRoutes;