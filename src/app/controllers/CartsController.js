const Carts = require('../models/Carts');

class CartsController {

    //[GET] /carts
    show(req, res, next) {
        if (req.session.loggedIn) {
            const userId = req.session.userId;
            Promise.all([
                Carts.getAllProductsInCartByUserId(userId),
                Carts.totalCost(userId),
                Carts.numberOfProducts(userId)
            ])
                .then(([products, totalCost, numberOfProducts]) => res.render('carts/show',
                    { products: products, totalCost: totalCost, numberOfProducts: numberOfProducts }
                ))
                .catch(next);
        }else{
            res.status(401).render('error', { message: 'Vui lòng đăng nhập để xem giỏ hàng.' });
        }
    }

    //[POST] /carts/add/:id
    addToCart(req, res, next) {
        const userId = req.session.userId;
        const productId = req.params.id;
        const { quantity } = req.body;
        const values = [userId, productId, quantity];
        Carts.checkIfProducts(userId, productId)
            .then((hasProducts) => {
                if (hasProducts) {
                    Carts.quantityOfProduct(userId, productId)
                        .then((quantity) => {
                            const newQuantity = Number(req.body.quantity) + Number(quantity[0].quantity);
                            Carts.updateQuantity(newQuantity, userId, productId)
                                .then(() => res.redirect('/carts'))
                                .catch(next)
                        })
                        .catch(next)
                } else {
                    Carts.addToCart(values)
                        .then(() => {
                            res.redirect('/carts');
                        })
                        .catch(next);
                }
            })
    }

    //[DELETE] /carts/:id
    delete(req, res, next) {
        const userId = req.session.userId;
        const productId = req.params.id;
        Carts.deleteProducts(userId, productId)
            .then(() => res.redirect('back'))
            .catch(next);
    }
}

module.exports = new CartsController;