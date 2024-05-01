const express = require('express');
const userController = require('../controllers/userController');
const isAuthenticated = require('../middlewares/isAuth');

const userRouter = express.Router();
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login)
userRouter.get('/profile', isAuthenticated, userController.profile)

module.exports = userRouter;