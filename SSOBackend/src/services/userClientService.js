import db from '../models/index';
import bcrypt from 'bcrypt';
import JWTController from '../middlewares/jwt.m';
import JWTService from '../services/JWTService';
import { v4 as uuidv4 } from 'uuid';

const SALT_ROUND = bcrypt.genSaltSync(10);

const hashUserPassword = async (rawPassword) => {
    return await bcrypt.hash(rawPassword, SALT_ROUND);
};



const checkPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

const createNewUser = async (newUser) => {
    try {
        let existingUser = await db.User.findOne({
            where: { email: newUser.email }
        });

        if (existingUser) {
            return {
                errCode: '-1',
                errMsg: 'The email is already in use',
                data: null,
            }
        }


        let hashedPassword = await hashUserPassword(newUser.password);

        await db.User.create({
            ...newUser,
            password: hashedPassword,
        });

        return {
            errCode: '0',
            errMsg: 'New user is created successfully',
            data: null,
        }

    } catch (error) {
        console.log("Error: ", error.message);
        return {
            errCode: '-2',
            errMsg: 'Something wrong creating new user ...',
            data: null,
        }
    }

};

const generateAccessToken = async (userEmail) => {
    try {
        const user = await db.User.findOne({
            where: { email: userEmail }
        });

        if (!user) {
            throw new Error('User not found');
        }

        const group_role_list = await JWTService.getGroupWithRoles(user);
        const payload = {
            email: user.email,
            username: user.username,
            group_role_list,
        }

        const accessToken = await JWTController.signToken(payload);
        return accessToken;
    } catch (error) {
        console.log("Error generating access token for user, error: ", error.message);
        return '';
    }
}

const handleLogin = async (rawUser) => {
    try {
        let existingUser = await db.User.findOne({
            where: {
                email: rawUser.email,
                type: 'LOCAL',
            }
        });

        existingUser = existingUser?.dataValues;

        if (!existingUser) {
            return {
                errCode: '-1',
                errMsg: 'Email or password is incorrect',
                data: null,
            }
        }

        let passwordState = await checkPassword(rawUser.password, existingUser.password);
        if (passwordState === true) {
            return {
                errCode: '0',
                errMsg: 'Login successfully',
                data: {
                    code: uuidv4().toString(),
                    email: existingUser.email,
                },
            }
        } else {
            return {
                errCode: '-1',
                errMsg: 'Email or password is incorrect',
                data: null,
            }
        }

    } catch (error) {
        console.log("Error: ", error.message);
        return {
            errCode: '-2',
            errMsg: 'Something wrong logging user ...',
            data: null,
        }
    }
}

const showUserList = async () => {
    try {
        let userList = await db.User.findAll({
            attributes: ["id", "email", "username", "phone", "sex", "address"],
            include: { model: db.Group, attributes: ["name", "description", "id"] },
            nest: true
        });
        if (userList) {
            userList = userList.map((user) => {
                let returnedUser = {
                    ...user.dataValues,
                    password: null,
                }

                return returnedUser;
            });
            return {
                errCode: '0',
                errMsg: 'Get all users successfully',
                data: userList,
            }
        } else {
            return {
                errCode: '-2',
                errMsg: 'Something wrong getting all users ...',
                data: null,
            }
        }

    } catch (error) {
        console.log("Error: ", error.message);
        return {
            errCode: '-2',
            errMsg: 'Something wrong getting all users ...',
            data: null,
        }
    }
};

const showUserListWithPagination = async (page, limit) => {
    page = parseInt(page);
    limit = parseInt(limit);
    let offset = (page - 1) * limit;
    try {
        const { count, rows } = await db.User.findAndCountAll({
            attributes: ["id", "email", "username", "phone", "sex", "address"],
            include: { model: db.Group, attributes: ["name", "description", "id"] },
            nest: true,
            offset: offset,
            limit: limit,
            order: [
                ['id', 'DESC'],
            ]
        });

        if (count && rows) {
            let data = {
                total: count,
                totalPage: Math.ceil(count / limit),
                userList: rows
            }

            return {
                errCode: '0',
                errMsg: 'Get all users successfully',
                data: data,
            }
        } else {
            return {
                errCode: '-1',
                errMsg: 'Something wrong getting all users with pagination ...',
                data: null,
            }
        }

    } catch (error) {
        console.log("Error: ", error.message);
        return {
            errCode: '-2',
            errMsg: 'Something wrong getting all users  with pagination ...',
            data: null,
        }
    }
};


const updateUser = async (data) => {
    if (!data.group) {
        return {
            errCode: '-1',
            errMsg: 'Group is required',
            data: null,
        }
    }

    try {
        let user = await db.User.findOne({
            where: {
                id: data.id,
            }
        });

        if (user) {
            await user.update({
                ...data,
                email: user.email,
            });

            return {
                errCode: '0',
                errMsg: 'Update user successfully',
                data: null,
            }
        } else {
            //TODO: Not found
            return {
                errCode: '-1',
                errMsg: 'User not found',
                data: null,
            }
        }

    } catch (error) {
        console.log("Error: ", error.message);
        return {
            errCode: '-2',
            errMsg: 'Something wrong updating user ...',
            data: null,
        }
    }
};

const deleteUser = async (userID) => {
    try {
        if (!userID) {
            return {
                errCode: '-1',
                errMsg: 'User id is required',
                data: null,
            }
        }

        let user = await db.User.findOne({
            where: {
                id: userID
            }
        });

        if (user) {
            await user.destroy();
            return {
                errCode: '0',
                errMsg: 'Delete user successfully',
                data: null,
            }
        } else {
            return {
                errCode: '-1',
                errMsg: 'Something wrong getting user by id to delete ...',
                data: null,
            }
        }

    } catch (error) {
        console.log("Error: ", error.message);
        return {
            errCode: '-2',
            errMsg: 'Something wrong deleting user ...',
            data: null,
        }
    }
};


const updateUserRefreshToken = async (email, token) => {
    try {
        const user = await db.User.findOne({
            where: {
                email: email,
            }
        });

        if (!user) {
            return {
                status: false,
                message: 'User not found',
            }
        }

        await user.update({
            refreshToken: token,
        });

        return {
            message: `Update user's refresh token successfully`,
            status: true,
            data: user,
        }
    } catch (error) {
        console.log("Error: ", error.message);
        return {
            status: false,
            message: `Something wrong updating user's refresh token ...`,
        }
    }
};

const upsertUserFromSocialMedia = async (type, rawData) => {
    try {
        let user = null;
        user = await db.User.findOne({
            where: {
                email: rawData?.email,
                type: type,
            },
            raw: true,
        })

        if (!user) {
            console.log(`!! Create new user from ${type} account`);
            user = await db.User.create({
                email: rawData?.email,
                username: rawData?.username,
                type: type,
            })

            user = user.get({ plain: true });
        } else {
            console.log(`!! Login with ${type} account, username:  ${rawData?.username}`);
        }

        user.code = uuidv4().toString();
        return user;
    } catch (error) {
        console.log("Error upserting user from social media, error: " + error?.message ?? error);
    }
}

const getUserByRefreshToken = async (refreshToken) => {
    try {
        const user = await db.User.findOne({
            where: {
                refreshToken: refreshToken
            },
        });

        if (user) {
            const groupWithRoles = await JWTService.getGroupWithRoles(user);
            return {
                email: user?.email,
                username: user?.username,
                groupWithRoles
            }
        }

        return null;
    } catch (error) {
        console.log("Error getting user by refresh token, error: " + error?.message ?? error);
    }
}

const updateUserOTPCode = async (email, code) => {
    try {
        const user = await db.User.findOne({
            where: {
                email: email,
                type: 'LOCAL',
            }
        });

        if (!user) {
            return {
                status: false,
                message: 'User not found',
            }
        }

        await user.update({
            OTPCode: code,
        });

        return {
            message: `Update user's OTP code successfully`,
            status: true,
            data: user,
        }
    } catch (error) {
        console.log("Error: ", error.message);
        return {
            status: false,
            message: `Something wrong updating user's OTP code ...`,
        }
    }
}


const handleResetUserPassword = async (rawData) => {
    console.log(">> Raw data: ");
    console.log(rawData);

    try {
        const user = await db.User.findOne({
            where: {
                email: rawData?.email,
                type: 'LOCAL',
            },
            attributes: ['id', 'username', 'password', 'email', 'refreshToken', 'OTPCode']
        });

        if (!user) {
            return {
                status: false,
                message: 'User not found!',
            }
        } else if (user?.OTPCode !== rawData?.OTPCode) {
            console.log(`User ${user?.OTPCode} vs data ${rawData?.OTPCode}`);
            return {
                status: false,
                message: 'OTP Code not match!',
            }
        }

        const isTheSamePassword = await checkPassword(rawData?.new_password, user?.password)
        if (isTheSamePassword === true) {
            return {
                status: false,
                message: `New password is the same with the original one!`,
                data: null,
            }
        }

        const newPassword = await hashUserPassword(rawData?.new_password);
        await user.update({
            password: newPassword,
        });

        return {
            message: `Reset user's password successfully`,
            status: true,
            data: {
                ...user,
                password: null,
            },
        }
    } catch (error) {
        console.log("Error: ", error.message);
        return {
            status: false,
            message: `Something wrong resetting user password ...`,
        }
    }
}

const UserClientService = {
    createNewUser,
    handleLogin,
    showUserList,
    showUserListWithPagination,
    updateUser,
    deleteUser,
    updateUserRefreshToken,
    generateAccessToken,
    upsertUserFromSocialMedia,
    getUserByRefreshToken,
    updateUserOTPCode,
    handleResetUserPassword,
}

module.exports = UserClientService;