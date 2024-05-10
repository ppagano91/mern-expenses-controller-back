const express = require('express');
const categoryController = require('../controllers/categoryController');
const isAuthenticated = require('../middlewares/isAuth');

const categoryRouter = express.Router();
categoryRouter.get('/list', isAuthenticated, categoryController.list)
categoryRouter.get('/category/:id', isAuthenticated, categoryController.byId);
categoryRouter.post('/create', isAuthenticated, categoryController.create);
categoryRouter.put('/update/:id', isAuthenticated, categoryController.update);
categoryRouter.delete('/delete/:id', isAuthenticated, categoryController.delete);

module.exports = categoryRouter;