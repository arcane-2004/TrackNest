const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware.js');
const analysisController = require('../controllers/analysis.controller');

router.get('/category-summary/:accountId', authMiddleware.authUser, analysisController.categorySummary);

module.exports = router;