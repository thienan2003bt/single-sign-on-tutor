import db from '../models/index';

const getGroupWithRoles = async (user) => {
    try {
        let roleList = await db.Group.findOne({
            where: {
                id: user.groupId,
            },
            include: [{
                model: db.Role,
                attributes: ["id", "url", "description"],
                through: { attributes: [] }, //prevent joining mapping tables "Group_Role"
            }],
        });

        return roleList || {};
    } catch (error) {
        console.log("Get group_role error: " + error.message);
    }
}


const JWTService = {
    getGroupWithRoles,

}


module.exports = JWTService;