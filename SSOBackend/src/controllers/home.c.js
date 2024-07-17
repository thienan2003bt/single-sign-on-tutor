import UserService from '../services/userService';

module.exports = {
    renderHome: async (req, res, next) => {
        try {
            return res.render('home.ejs');
        } catch (err) {
            next(err);
        }
    },

    renderUserPage: async (req, res, next) => {
        let userList = await UserService.getUserList();

        return res.render('user.ejs', {
            userList: userList
        });
    },

    renderUpdateUserPage: async (req, res, next) => {
        let userData = await UserService.getUserByID(req.params?.id);

        return res.render('user-update.ejs', {
            userData
        });
    },

    insertNewUser: async (req, res, next) => {
        const { email, username, password } = req.body;

        await UserService.createNewUser(email, password, username);

        return res.redirect('/user');
    },

    deleteUser: async (req, res, next) => {
        const { id } = req.params;

        await UserService.deleteUser(id);

        return res.redirect('/user');
    },

    updateUser: async (req, res, next) => {
        const { email, username } = req.body;
        await UserService.updateUser(email, username, req.params?.id);

        return res.redirect('/user');
    },
}