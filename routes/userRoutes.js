const express = require('express');
const userController = require('../controllers/userController');
const isAuthenticated = require('../middlewares/isAuth');

const userRouter = express.Router();
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login)
userRouter.get('/profile', isAuthenticated, userController.profile)
userRouter.put('/change-password', isAuthenticated, userController.changeUserPassword)
userRouter.put('/update-profile', isAuthenticated, userController.updateUserProfile)

module.exports = userRouter;