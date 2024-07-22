const renderLoginPage = (req, res, next) => {
    const { serviceURL } = req?.query;
    console.log("Service URL: " + serviceURL);
    return res.render('login.ejs', {
        error: req.flash('message') ?? '',
    });
}

const LoginController = {
    renderLoginPage
}


module.exports = LoginController;