import express from 'express';
const router = express.Router();

import HomeController from '../controllers/home.c';
import LoginController from '../controllers/login.c';
/**
 * 
 * @param {*} app - express app
 */
const initWebRoutes = (app) => {
    //GET
    router.get('/', HomeController.renderHome);
    router.get('/user', HomeController.renderUserPage);
    router.get('/user/update/:id', HomeController.renderUpdateUserPage);
    router.get('/login', LoginController.renderLoginPage);

    //POST
    router.post('/user/create', HomeController.insertNewUser)
    router.post('/user/delete/:id', HomeController.deleteUser);
    router.post('/user/update/:id', HomeController.updateUser);

    return app.use('/', router);
}

export default initWebRoutes;