import express from 'express';
import passport from 'passport';
import UserMiddleware from '../middlewares/user.m';

const router = express.Router();

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

    //POST
    router.post('/user/create', HomeController.insertNewUser)
    router.post('/user/delete/:id', HomeController.deleteUser);
    router.post('/user/update/:id', HomeController.updateUser);
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
    }));
    router.post('/logout', PassportController.handleLogout);


    return app.use('/', router);
}

export default initWebRoutes;