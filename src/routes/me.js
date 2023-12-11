const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController');

router.get('/login', meController.login);
router.get('/password', meController.password);
router.post('/change-password', meController.changePassword);
router.post('/check', meController.check);
router.post('/logout', meController.logout);
router.get('/logup', meController.logup);
router.post('/store', meController.store);
router.get('/profile', meController.profile);

module.exports = router;