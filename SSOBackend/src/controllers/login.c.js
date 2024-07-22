import passport from 'passport';

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

const LoginController = {
    renderLoginPage,
    handleLogin
}


module.exports = LoginController;