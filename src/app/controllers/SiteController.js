const User = require('../models/User.js');

class SiteController {

    index(req, res, next) {
        User.getAllUsers()
            .then(users => res.render('home', {
                users: users
            }));
    }

}

module.exports = new SiteController;