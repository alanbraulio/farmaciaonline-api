const express = require('express');
const router = express.Router();
const authController = require('./controller/authController');


router.post('/login', authController.login );

router.get('/verifyToken', authController.verifyToken);

// router.post('/change-password', authController.changePassword);

module.exports = router;