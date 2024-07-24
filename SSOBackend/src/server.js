import express from 'express';
import configViewEngine from './config/viewEngine';
import initWebRoutes from './routes/web.r';
import initAPIRoutes from './routes/api.r';
import configCORS from './config/cors';
import connection from './config/connectDB';
import cookieParser from 'cookie-parser';

import PassportController from './controllers/passport.c';
import GoogleController from './controllers/social/google.c';
import SessionConfig from './config/session';
import flash from 'connect-flash';


require('dotenv').config();
const PORT = process.env.PORT || 8080; //8080 by default

const app = express();

//middleware for crossing origin resource sharing (cors)
configCORS(app);

//config express middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(flash());

//config session middlewares for passport
SessionConfig.configSession(app);

//config view engine
configViewEngine(app);

// connect to DB
connection();

//init view engine
initWebRoutes(app);
initAPIRoutes(app);

PassportController.configPassport();
GoogleController.configLoginWithGoogle();

app.use((req, res) => {
    return res.send("404 not found");
})

app.listen(PORT, () => {
    console.log("Single-Sign-On Server is listening on port " + PORT + ", url: http://localhost:" + PORT);
})