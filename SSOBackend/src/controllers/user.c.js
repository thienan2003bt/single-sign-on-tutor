import UserClientService from '../services/userClientService';

const showUserList = async (req, res, next) => {
    try {
        let page = req.query?.page;
        let limit = req.query?.limit;
        let userList = [];
        if (page && limit) {
            userList = await UserClientService.showUserListWithPagination(page, limit);

        } else {
            userList = await UserClientService.showUserList();
        }
        res.status(200).json(userList);
    } catch (error) {
        next(error);
    }
};

const createNewUser = async (req, res, next) => {
    try {
        let response = await UserClientService.createNewUser(req.body);
        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        let response = await UserClientService.updateUser(req.body);
        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        let response = await UserClientService.deleteUser(req.body?.id);
        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

const getUserAccount = async (req, res, next) => {
    return res.status(200).json({
        errCode: '0',
        errMsg: 'User account is available',
        data: {
            ...req.user,
        }
    })
}


module.exports = {
    showUserList,
    createNewUser,
    updateUser,
    deleteUser,
    getUserAccount
};