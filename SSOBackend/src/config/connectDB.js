const { Sequelize } = require('sequelize');

//databasename, username, password
const sequelize = new Sequelize('jwt_auth_manager', 'root', null, {
    host: 'localhost',
    dialect: 'mysql'
});

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connect is established successfully");
    } catch (error) {
        console.error("Unable to connect to database, err: " + error.message);
    }
}

export default connection;