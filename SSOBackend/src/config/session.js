import session from 'express-session';
import Sequelize from 'sequelize';
import passport from 'passport';


const configSession = (app) => {
    const SequelizeStore = require('connect-session-sequelize')(session.Store);

    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
        define: {
            freezeTableName: true
        },
        timezone: '+07:00',
    });

    const myStore = new SequelizeStore({
        db: sequelize,
    });

    app.use(
        session({
            secret: "keyboard cat",
            store: myStore,
            resave: false,
            proxy: true,
            saveUninitialized: false,
            expiration: 30 * 1000, //for database
            cookie: { expires: 30 * 1000 }, //for browser
            // TODO: have to move this into .env file
        })
    );

    myStore.sync();
    app.use(passport.authenticate('session'));

    passport.serializeUser((user, callback) => {
        process.nextTick(() => {
            callback(null, user);
        });
    });
    passport.deserializeUser((user, callback) => {
        process.nextTick(() => {
            return callback(null, user);
        });
    });
}


const SessionConfig = {
    configSession
}

module.exports = SessionConfig;