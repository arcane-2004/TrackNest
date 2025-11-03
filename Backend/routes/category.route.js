const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.get('/get-categories', authMiddleware.authUser, categoryController.getCategories);

module.exports = router;
