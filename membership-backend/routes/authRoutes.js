const express = require('express');
// const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.use(authController.restrictTo('admin', 'super-admin'));
router.post('/admin/create-user', authController.createUser);

module.exports = router;
