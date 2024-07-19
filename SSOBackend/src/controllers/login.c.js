const renderLoginPage = (req, res, next) => {
    return res.render('login.ejs', {
        error: req.flash('message') ?? '',
    });
}

const LoginController = {
    renderLoginPage
}


module.exports = LoginController;