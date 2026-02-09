const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);

router.use(authController.restrictTo('admin', 'super-admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/admin/:id')
  .get(userController.getUser)
  .patch(userController.addMemberDetailsAdmin)
  .delete(userController.deleteUser);

//  router.patch('/admin/member/:memberId', userController.);

router.use(authController.restrictTo('super-admin'));
router.post('/admin/change-user-role', userController.changeUserRole);

module.exports = router;
