const express = require('express');
const transactionController = require('../controllers/transactionController');
const isAuthenticated = require('../middlewares/isAuth');

const transactionRouter = express.Router();
transactionRouter.get('/list', isAuthenticated, transactionController.filteredListTransactions)
transactionRouter.post('/create', isAuthenticated, transactionController.create);

module.exports = transactionRouter;