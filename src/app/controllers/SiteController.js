const Product = require('../models/Products');
const User = require('../models/Users');

class SiteController {

    index(req, res, next) {
        Product.getAllProducts()
            .then(products => {
                res.render('home', {
                    products: products
                })
            });
    }

    //[GET] /users
    users(req, res, next) {
        if (req.session.isAdmin) {
            Promise.all([
                User.getAllUsers(),
                User.numberOfUsers()
            ])
                .then(([users, numberOfUsers]) => res.render('users', { users: users, numberOfUsers: numberOfUsers[0] }))
                .catch(next);
        } else {
            res.status(401).render('error', { message: 'Chỉ admin mới vào được trang này.' });
        }
    }

    // [GET] /search
    search(req, res, next) {
        const productName = req.query.keyword;
        Product.searchForProducts('%' + productName + '%')
            .then(products => {
                res.render('search', { products: products, keyword: productName })
            })
            .catch(next);
    }

    // [DELETE] /:userId
    deleteUser(req, res, next) {
        User.deleteUserById(req.params.userId)
            .then(() => {
                res.redirect('back');
            })
            .catch(next);
    }

    // /[GET] /products
    products(req, res, next) {
        if (req.session.isAdmin) {
            Promise.all([
                Product.getAllProducts(),
                Product.numberOfProducts()
            ])
                .then(([products, numberOfProducts]) => res.render('products', { products: products , numberOfProducts: numberOfProducts[0]}))
                .catch(next);
        } else {
            res.status(401).render('error', { message: 'Chỉ admin mới vào được trang này.' });
        }
    }

    // [DELETE] /:productId
    deleteProduct(req, res, next) {
        Product.deleteProductsById(req.params.productId)
            .then(() => {
                res.redirect('back');
            })
            .catch(next);
    }

}

module.exports = new SiteController;