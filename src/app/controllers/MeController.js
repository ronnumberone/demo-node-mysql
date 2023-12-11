const User = require('../models/Users');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const Products = require('../models/Products');

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        try {
            const hashedPassword = bcrypt.hash(password, 6);
            resolve(hashedPassword);
        } catch (error) {
            reject(error);
        }
    });
}

async function comparePassword(inputPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(inputPassword, hashedPassword);
        return match;
    } catch (error) {
        return false;
    }
}


class MeController {

    //[GET] /me/login
    login(req, res) {
        res.render('me/login');
    }

    //[GET] /me/logup
    logup(req, res) {
        res.render('me/logup')
    }

    //[POST] /products/check
    check(req, res, next) {
        const { userName, password } = req.body;
        User.getHashedPassword(userName)
            .then(async (hashedPassword) => {
                const isMatch = await comparePassword(password, hashedPassword);
                if (isMatch) {
                    User.getUserIdByName(userName).then(userId => {
                        req.session.userId = userId
                        req.session.userName = userName;
                        req.session.loggedIn = true;
                        User.checkAdmin(userId)
                            .then((isAdmin => {
                                if (isAdmin) {
                                    req.session.isAdmin = true;
                                }
                                res.redirect('/');
                            }))
                    });

                } else {
                    res.render('me/login', { wrongPassword: true });
                }
            })
            .catch((userIsNotCreated) => res.render('me/login', { userIsNotCreated: userIsNotCreated }));
    }


    //[POST] /me/store
    store(req, res, next) {
        const userId = uuidv4();
        const { userName, password } = req.body;
        hashPassword(password)
            .then((hashedPassword) => {
                const values = [userId, userName, hashedPassword];
                User.createUser(values)
                    .then(() => {
                        req.session.userId = userId
                        req.session.userName = userName;
                        req.session.loggedIn = true;
                        res.redirect('/');
                    })
                    .catch((duplicate) => res.render('me/logup', { duplicate: duplicate }));
            })
            .catch((error) => {
                console.error('Lỗi khi băm mật khẩu:', error);
            });
    }

    //[POST] /me/logout
    logout(req, res, next) {
        req.session.userName = "";
        req.session.userId = "";
        req.session.loggedIn = false;
        req.session.isAdmin = false;
        res.redirect('/');
    }

    //[GET] /me/profile
    profile(req, res, next) {
        if (req.session.loggedIn) {
            Products.getProductsByUserName(req.session.userName)
                .then(products => {
                    for (let i in products) {
                        products[i].image = "http://localhost:4000/" + products[i].image;
                    }
                    res.render('me/profile', { products: products })
                })
                .catch(next);
        } else {
            res.status(401).render('error', { message: 'Vui lòng đăng nhập để xem trang cá nhân.' });
        }
    }

    //[GET] /me/password
    password(req, res, next) {
        if (req.session.loggedIn) {
            res.render('me/password');
        } else {
            res.status(401).render('error', { message: 'Vui lòng đăng nhập để đổi mật khẩu.' });
        }
    }

    //[POST] /me/change-password
    changePassword(req, res, next) {
        const { oldPassword, password } = req.body;
        const userName = req.session.userName;
        User.getHashedPassword(userName)
            .then(async (hashedPassword) => {
                const isMatch = await comparePassword(oldPassword, hashedPassword);
                if (isMatch) {
                    if (oldPassword !== password) {
                        hashPassword(password)
                            .then(password => {
                                User.changePassword(userName, password)
                                    .then(() => res.redirect('/'))
                                    .catch(next);
                            })
                    } else {
                        res.render('me/password', { duplicatePassword: true });
                    }
                } else {
                    res.render('me/password', { wrongPassword: true });
                }
            })
            .catch(next);
    }
}

module.exports = new MeController;