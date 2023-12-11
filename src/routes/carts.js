const express = require('express');
const router = express.Router();

const cartsController = require('../app/controllers/CartsController');

router.get('/', cartsController.show);
router.post('/add/:id', cartsController.addToCart);
router.delete('/:id', cartsController.delete)

module.exports = router;