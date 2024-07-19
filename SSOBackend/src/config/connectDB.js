require('dotenv').config();
const { Sequelize } = require('sequelize');

//databasename, username, password
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    define: {
        freezeTableName: true
    }
});

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connect to database is established successfully");
    } catch (error) {
        console.error("Unable to connect to database, err: " + error.message);
    }
}

export default connection;