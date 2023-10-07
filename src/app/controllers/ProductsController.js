const { v4: uuidv4 } = require('uuid');
const Product = require('../models/Products');

class ProductsController {

    //[GET] /products/create
    create(req, res, next) {
        res.render('products/create');
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
            const userId = '123';
            const sql = 'INSERT INTO products (productId, productName, productCost, productDescription, image, userId) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [productId, productName, productCost, productDescription, image.name, userId];
            Product.createProduct(sql, values)
                .then(() => res.redirect('/'));
        });

    }
}

module.exports = new ProductsController;