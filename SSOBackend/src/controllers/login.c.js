import passport from 'passport';
import { v4 as uuidv4 } from 'uuid';
import UserClientService from '../services/userClientService';

const renderLoginPage = (req, res, next) => {
    const { serviceURL } = req?.query;
    console.log("Service URL: " + serviceURL);
    return res.render('login.ejs', {
        error: req.flash('message') ?? '',
        serviceURL: serviceURL
    });
}

const handleLogin = (req, res, next) => {
    const serviceURL = req.query?.serviceURL ?? 'http://localhost:8080';

    passport.authenticate('local', {
        // successRedirect: '/',
        failureRedirect: '/login',
    }, (err, user, info) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (!user) {
            return res.status(401).json(info.message);
        }


        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json(err);
            }
            // return res.status(200).redirect(`${serviceURL}code?ssoToken=${user?.code ?? ''}`);
            return res.status(200).json({
                ...user,
                serviceURL: serviceURL
            });
        });
    })(req, res, next);
}

const verifySSOToken = async (req, res, next) => {
    const SSOToken = req.body?.token ?? '';
    console.log(">>> SSOToken from FE: " + SSOToken);
    // Validate domains that are allowed to access

    // Generate tokens for user
    if (req.user && req.user?.code && req.user?.code === SSOToken) {
        const refreshToken = uuidv4();
        const updateStatus = await UserClientService.updateUserRefreshToken(req.user?.email, refreshToken);

        if (updateStatus && updateStatus?.status && updateStatus?.status === true) {
            const accessToken = await UserClientService.generateAccessToken(req.user?.email);
            if (!accessToken) {
                return res.status(500).json({
                    errCode: 3,
                    errMsg: updateStatus?.message ?? `Error generating access token`,
                    data: null,
                });
            }
            return res.status(200).json({
                errCode: 0,
                errMsg: 'Verify SSOToken successfully',
                data: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                },
            });
        } else {
            return res.status(500).json({
                errCode: 2,
                errMsg: updateStatus?.message ?? `Error updating SSOToken`,
                data: null,
            });
        }


    } else {
        return res.status(401).json({
            errCode: 1,
            errMsg: 'Invalid token',
            data: null,
        });
    }

}



const LoginController = {
    renderLoginPage,
    handleLogin,
    verifySSOToken
}


module.exports = LoginController;