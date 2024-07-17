import bcrypt from 'bcrypt';
import db from '../models/index';

const SALT_ROUND = bcrypt.genSaltSync(10);

/**
 * 
 * @param {*} rawPassword - password inputted from client
 * @returns hashed password by bcrypt
 */
const hashUserPassword = async (rawPassword) => {
    return await bcrypt.hash(rawPassword, SALT_ROUND);
};

/**
 * 
 * @returns list of users in database 
 */
const getUserList = async () => {
    try {

        /*
        Test relationship
        let userList = await db.User.findOne({
            where: {
                id: 1
            },
            attributes: ["id", "email", "username"],
            raw: true,
            include: { model: db.Group, attributes: ["name", "description"]},
            nest: true
        });

        let roleList = await db.Role.findAll({
            raw: true,
            include: { model: db.Group, where: {
                id: 1
            }},
            nest: true
        });
        */

        let userList = await db.User.findAll();
        return userList;
    } catch (error) {
        console.log("Error: ", error.message);
    }

}

/**
 * 
 * @param {*} email - email inputted from client
 * @param {*} password - password inputted from client
 * @param {*} username - username inputted from client
 */
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


/**
 * 
 * @param {*} userID - user id wanted to delete
 */
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


/**
 * 
 * @param {*} userID - user id wanted to update
 * @returns - all user's data
 */
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


/**
 * 
 * @param {*} email - new user email 
 * @param {*} username - new user username 
 * @param {*} userID - user id wanted to update
 */
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