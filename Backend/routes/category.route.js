const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.get('/get-categories', authMiddleware.authUser, categoryController.getCategories);

router.post('/add', authMiddleware.authUser, categoryController.addCategory);

router.put('/update/:id', authMiddleware.authUser, categoryController.updateCategory)

module.exports = router;
