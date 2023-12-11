const newsRouter = require('./news');
const siteRouter = require('./site');
const productsRouter = require('./products');
const cartsRouter = require('./carts');
const meRouter = require('./me');

function route(app) {

    app.use('/news', newsRouter);

    app.use('/products', productsRouter);

    app.use('/carts', cartsRouter);

    app.use('/me', meRouter);

    app.use('/', siteRouter);

}

module.exports = route;