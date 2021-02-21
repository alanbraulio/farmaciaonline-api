const express = require('express');
const router = express.Router();

const userController = require('./controllers/userControllers');


router.get('/:id', userController.get_user );

router.get('/', userController.get_all_users);

router.post('/', userController.create_user);

router.patch('/:id', userController.update_user);

router.delete('/:id', userController.delete_user);

module.exports = router;