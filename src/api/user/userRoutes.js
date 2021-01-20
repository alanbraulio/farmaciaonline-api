const express = require('express');
const router = express.Router();

const userController = require('./controllers/userControllers');

router.get('/', userController.get_all_users);

router.post('/', userController.create_user);

// router.post('/', userController.user_Login);

router.put('/update/:id', userController.update_user);

router.delete('/delete/:id', userController.delete_user);

module.exports = router;