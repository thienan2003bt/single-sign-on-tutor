import db from '../models/index';
import _ from 'lodash';

const showRoleList = async (groupID) => {
    try {
        let data = [];
        if (groupID) {
            data = await db.Group.findAll({
                where: {
                    id: groupID
                },
                include: {
                    model: db.Role,
                    attributes: ['id', 'url', 'description'],
                    order: [['id', 'desc']],
                    through: { attributes: [] },
                },
                attributes: ['id', 'name', 'description'],
                raw: true,
                nest: true
            });
        } else {
            data = await db.Role.findAll({
                attributes: ['id', 'url', 'description'],
                raw: true,
                order: [['id', 'desc']]
            });
        }

        return {
            errCode: '0',
            errMsg: 'All roles returned successfully',
            data: data
        }
    } catch (error) {
        return {
            errCode: '-2',
            errMsg: 'Service error: ' + error.message,
            data: null
        }
    }
}

const createNewRole = async (newRoleData) => {
    try {
        let currentRoles = await db.Role.findAll({
            attributes: ['url', 'description'],
            raw: true,
        })

        let newRoleDataLength = Object.entries(newRoleData).length;

        let persistData = [];
        for (let i = 0; i < newRoleDataLength; i++) {
            let url1 = newRoleData[i].url;
            for (let j = 0; j < currentRoles.length; j++) {
                let url2 = currentRoles[j].url;
                if (url1 === url2) {
                    continue;
                } else if (j === currentRoles.length - 1) {
                    persistData.push(newRoleData[i]);
                }

            }
        }

        if (persistData?.length === 0) {
            return {
                errCode: '1',
                errMsg: 'Nothing to create due to duplicate role',
                data: null,
            }
        }

        await db.Role.bulkCreate(persistData);

        return {
            errCode: '0',
            errMsg: `Create ${persistData.length} new roles successfully`,
            data: persistData,
        }
    } catch (error) {
        return {
            errCode: '-2',
            errMsg: 'Something went wrong when creating new role',
            data: null,
        }
    }
}

const updateRole = async (roleData) => {
    try {
        let role = await db.Role.findOne({
            where: {
                id: roleData.id,
            }
        });

        if (role) {
            await role.update({
                ...roleData,
            });

            return {
                errCode: '0',
                errMsg: 'Update role successfully',
                data: null,
            }
        } else {
            //TODO: Not found
            return {
                errCode: '-1',
                errMsg: 'Role not found',
                data: null,
            }
        }
    } catch (error) {
        return {
            errCode: '-2',
            errMsg: 'Service error: ' + error.message,
            data: null
        }
    }
}

const deleteRole = async (roleID) => {
    try {
        if (!roleID) {
            return {
                errCode: '-1',
                errMsg: 'Role id is required',
                data: null,
            }
        }

        let role = await db.Role.findOne({
            where: {
                id: roleID
            }
        });

        if (role) {
            await role.destroy();
            return {
                errCode: '0',
                errMsg: 'Delete role successfully',
                data: null,
            }
        } else {
            return {
                errCode: '-1',
                errMsg: 'Something wrong getting role by id to delete ...',
                data: null,
            }
        }
    } catch (error) {
        return {
            errCode: '-2',
            errMsg: 'Service error: ' + error.message,
            data: null
        }
    }
}

const assignRoleToGroup = async (data) => {
    try {
        await db.Group_Role.destroy({
            where: {
                groupId: +data.groupId
            }
        });

        await db.Group_Role.bulkCreate(data.groupRoles);
        return {
            errCode: '0',
            errMsg: 'Assign roles to group successfully',
            data: null
        }
    } catch (error) {
        return {
            errCode: '-2',
            errMsg: 'Service error: ' + error.message,
            data: null
        }
    }
}
module.exports = {
    createNewRole,
    showRoleList,
    updateRole,
    deleteRole,
    assignRoleToGroup
}