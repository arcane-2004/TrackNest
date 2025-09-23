const express = require('express');
const router = express.Router();
const {body} = require('express-validator')
const accountController = require('../controllers/account.controller');
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/add', authMiddleware.authUser, accountController.addAccount)

router.get('/get-accounts', authMiddleware.authUser, accountController.getAccounts)


module.exports = router;