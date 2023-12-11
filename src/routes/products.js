const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const productsController = require('../app/controllers/ProductsController');

router.get('/create', upload.single('image'), productsController.create);
router.post('/store', productsController.store);
router.get('/:id/edit', productsController.edit);
router.put('/:id', productsController.update);
router.get('/:id', productsController.show);
router.delete('/:id', productsController.delete);

module.exports = router;