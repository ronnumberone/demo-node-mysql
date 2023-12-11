const Product = require('../models/Products');
const { v4: uuidv4 } = require('uuid');

class ProductsController {

    //[GET] /products/:slug
    show(req, res, next) {
        Product.getProductById(req.params.id)
            .then(product => {
                product[0].image = "http://localhost:4000/" + product[0].image;
                res.render('products/show', { product: product[0] })
            })
            .catch(next);
    }

    //[GET] /products/create
    create(req, res, next) {
        if (req.session.loggedIn) {
            res.render('products/create');
        } else {
            res.status(401).render('error', { message: 'Vui lòng đăng nhập để thêm sản phẩm.' });
        }
    }

    //[POST] /products/store
    store(req, res, next) {
        let image;
        let uploadPath;
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No file were uploaded');
        }
        image = req.files.image;
        uploadPath = 'D:/Vscode/Nodejs/demo3/uploads/' + image.name;
        image.mv(uploadPath, function (err) {
            if (err) return res.status(500).send(err);

            const { productName, productCost, productDescription } = req.body;
            const productId = uuidv4();
            const userId = req.session.userId;
            const values = [productId, productName, productCost, productDescription, image.name, userId];
            Product.createProduct(values)
                .then(() => res.redirect('/me/profile'));
        });
    }

    //[GET] /products/:id/edit
    edit(req, res, next) {
        if (req.session.loggedIn) {
            Product.getProductById(req.params.id)
                .then((product) => {
                    console.log(product);
                    res.render('products/edit', { product: product[0] });
                })
        } else {
            res.status(401).render('error', { message: 'Vui lòng đăng nhập để sửa sản phẩm.' });
        }
    }

    //[PUT] /products/:id
    update(req, res, next) {
        let image;
        let uploadPath;
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No file were uploaded');
        }
        image = req.files.image;
        uploadPath = 'D:/Vscode/Nodejs/demo3/uploads/' + image.name;
        image.mv(uploadPath, function (err) {
            if (err) return res.status(500).send(err);

            const { productName, productCost, productDescription } = req.body;
            const productId = req.params.id;
            const values = [productName, productCost, productDescription, image.name, productId];
            Product.updateProduct(values)
                .then(() => res.redirect('/me/profile'));
        });
    }

    //[DELETE] /products/:id
    delete(req, res, next) {
        Product.deleteProductsById(req.params.id)
            .then(() => {
                res.redirect('back');
            })
            .catch(next);
    }
}

module.exports = new ProductsController;