import express from 'express';
const router = express.Router();

import APIController from '../controllers/api.c';
import UserController from '../controllers/user.c';
import GroupController from '../controllers/group.c';
import RoleController from '../controllers/role.c';
import JWTController from '../controllers/jwt.c';


const initAPIRoutes = (app) => {
    //middlewares

    router.all('*', JWTController.checkUser, JWTController.checkUserPermission);

    //GET
    router.get('/test-api', APIController.getTestAPI);
    router.get('/user/show', UserController.showUserList);
    router.get('/group/show', GroupController.getAllGroups);
    router.get('/account', UserController.getUserAccount);
    router.get('/role/show', RoleController.showRoleList);
    router.get('/verify-services-jwt', JWTController.checkServiceJWT)

    //POST
    router.post('/signup', APIController.postSignup);
    router.post('/login', APIController.postLogin);
    router.post('/logout', APIController.postLogout);
    router.post('/user/create', UserController.createNewUser);
    router.post('/role/create', RoleController.createNewRole);
    router.post('/role/assign-to-group', RoleController.assignRoleToGroup);

    //PUT
    router.put('/user/update', UserController.updateUser);
    router.put('/role/update', RoleController.updateRole);

    //DELETE
    router.delete('/user/delete', UserController.deleteUser);
    router.delete('/role/delete', RoleController.deleteRole);

    return app.use('/api/v1/', router);
}

export default initAPIRoutes;