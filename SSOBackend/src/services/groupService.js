import db from '../models/index';

const getAllGroups = async () => {
    try {
        let data = await db.Group.findAll({
            order: [
                ['name', 'ASC'],
                ['description', 'ASC']
            ]
        });
        if (data) {
            data = data.map((group) => {
                return {
                    ...group.dataValues
                }
            })
            return {
                errCode: '0',
                errMsg: 'Get all groups successfully',
                data: data
            }
        } else {
            return {
                errCode: '-1',
                errMsg: 'Something wrong get all groups ...',
                data: null
            }
        }
    } catch (error) {
        console.log("Error: " + error.message);
        return {
            errCode: '-2',
            errMsg: 'Something wrong get all groups ...',
            data: null
        }
    };
}

let GroupService = {
    getAllGroups,
}

module.exports = GroupService;