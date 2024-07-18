const renderLoginPage = (req, res, next) => {
    return res.render('login.ejs');
}

const LoginController = {
    renderLoginPage
}


module.exports = LoginController;