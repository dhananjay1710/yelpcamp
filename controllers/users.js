const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async(req, res, next) => {
    try{
        const curr_user = new User({email: req.body.user.email, username: req.body.user.username});
        const reg_user = await User.register(curr_user, req.body.user.password);
        req.login(reg_user, err => {
            if(err){
                req.flash('error', 'Unable to login, try again!')
                return next(err);
            }
            res.redirect('/campgrounds'); 
        })   
    }catch(e){
        req.flash('error', 'Somebody is already using this email or username!')
        res.redirect('/register'); //add flash messages to show the error later.
    }
    
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome Back!');
    res.locals.currentUser = req.user;
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out');
    res.redirect('/campgrounds');
}