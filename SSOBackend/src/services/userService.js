import bcrypt from 'bcrypt';
import db from '../models/index';

const SALT_ROUND = bcrypt.genSaltSync(10);

const hashUserPassword = async (rawPassword) => {
    return await bcrypt.hash(rawPassword, SALT_ROUND);
};

const getUserList = async () => {
    try {


        let userList = await db.User.findAll();
        return userList;
    } catch (error) {
        console.log("Error: ", error.message);
    }

}

const createNewUser = async (email, password, username) => {
    try {
        let hashedPassword = await hashUserPassword(password);

        await db.User.create({
            username,
            email,
            password: hashedPassword,
        });

    } catch (error) {
        console.log("Error: ", error.message);
    }

};


const deleteUser = async (userID) => {
    try {
        await db.User.destroy({
            where: {
                id: userID,
            }
        });
    } catch (error) {
        console.log("Error: ", error.message);
    }
};


const getUserByID = async (userID) => {
    try {
        let user = await db.User.findByPk(userID);

        let userData = {
            ...user.dataValues,
            password: null,
        };
        return userData;

    } catch (error) {
        console.log("Error: ", error.message);
    }
};


const updateUser = async (email, username, userID) => {
    try {
        await db.User.update(
            { email: email, username: username }, {
            where: {
                id: userID,
            }
        });
    } catch (error) {
        console.log("Error: ", error.message);
    }
};

module.exports = {
    hashUserPassword,
    getUserList,
    createNewUser,
    deleteUser,
    getUserByID,
    updateUser
};