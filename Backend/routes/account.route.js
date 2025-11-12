const express = require('express');
const router = express.Router();
const {body} = require('express-validator')
const accountController = require('../controllers/account.controller');
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/add', authMiddleware.authUser, accountController.addAccount)

router.get('/get-accounts', authMiddleware.authUser, accountController.getAccounts)

router.post('/update-default', authMiddleware.authUser, accountController.updateDefault)

router.put('/update/:id', authMiddleware.authUser, accountController.updateAccount)

router.get('/get/account/:id', authMiddleware.authUser, accountController.getAccountById)

router.delete('/delete/:id', authMiddleware.authUser, accountController.deleteAccount)

module.exports = router;