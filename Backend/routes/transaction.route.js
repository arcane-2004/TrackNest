const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/add', authMiddleware.authUser, transactionController.addTransaction)

router.get('/get-transactions', authMiddleware.authUser, transactionController.getTransactions);

router.get('/get/account-transaction/:id', authMiddleware.authUser, transactionController.getAccountTransactions);

router.post('/delete', authMiddleware.authUser, transactionController.deleteTransaction);

module.exports = router;