import GroupService from '../services/groupService';

const getAllGroups = async (req, res) => {
    let response = await GroupService.getAllGroups();
    return res.status(200).json(response);
};


let GroupController = {
    getAllGroups,
}

module.exports = GroupController;