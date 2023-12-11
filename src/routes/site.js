const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.use('/search', siteController.search);
router.get('/users', siteController.users);
router.get('/products', siteController.products);
router.delete('/:userId', siteController.deleteUser); 
router.post('/:productId', siteController.deleteProduct); 
router.use('/', siteController.index); 

module.exports = router;