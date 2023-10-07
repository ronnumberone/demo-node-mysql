const Product = require('../models/Products');

class SiteController {

    index(req, res, next) {
        Product.getAllUsers()
            .then(products => res.render('home', {
                products: products
            }));
    }

}

module.exports = new SiteController;