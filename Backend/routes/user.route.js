const express = require('express')
const router = express.Router()
const passport = require("passport")
const { body } = require('express-validator')
const googleAuth = require('../middlewares/googleAuth.middleware')
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const getAccessMiddleware = require('../middlewares/getAccess.middleware')

router.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account'
}))

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`
}),
googleAuth,
(req, res, next) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
});


router.post('/register',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:6}).withMessage('Password should be minimum 6 characters'),
], userController.registerUser )

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:6}).withMessage('Password should be minimum 6 characters'),
], userController.loginUser )

router.get('/profile', authMiddleware.authUser, userController.getUserProfile )

router.get('/logout', authMiddleware.authUser, userController.logoutUser)

router.get('/get/access', authMiddleware.authUser, getAccessMiddleware.getAccess)

router.post('/forget/password', userController.forgetPassword)

router.post('/verify/otp', userController.verifyOtp)

module.exports = router

