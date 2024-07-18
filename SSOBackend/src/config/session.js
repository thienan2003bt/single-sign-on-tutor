import session from 'express-session';
import Sequelize from 'sequelize';


const configSession = (app) => {
    const SequelizeStore = require('connect-session-sequelize')(session.Store);

    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
        define: {
            freezeTableName: true
        }
    });

    app.use(
        session({
            secret: "keyboard cat",
            store: new SequelizeStore({
                db: sequelize,
            }),
            resave: false,
            proxy: true,
        })
    );
}


const SessionConfig = {
    configSession
}

module.exports = SessionConfig;