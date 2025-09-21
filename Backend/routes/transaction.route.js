const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/add', authMiddleware.authUser, transactionController.addTransaction)

router.get('/get-transactions', authMiddleware.authUser, transactionController.getTransactions);

module.exports = router;