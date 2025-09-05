const express = require('express')
const router = express.Router()
const passport = require("passport")
const { body } = require('express-validator')
const googleAuth = require('../middlewares/googleAuth.middleware')

router.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account'
}))

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`
}), googleAuth,
    (req, res, next) => {
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
    })



module.exports = router

