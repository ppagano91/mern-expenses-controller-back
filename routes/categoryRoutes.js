const express = require('express');
const categoryController = require('../controllers/categoryController');
const isAuthenticated = require('../middlewares/isAuth');

const categoryRouter = express.Router();
categoryRouter.get('/list', isAuthenticated, categoryController.list)
categoryRouter.post('/create', isAuthenticated, categoryController.create);

module.exports = categoryRouter;