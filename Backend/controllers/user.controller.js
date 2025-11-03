const userModel = require('../models/user.model');
const categoryModel = require('../models/category.model');
const blackListTokenModel = require('../models/blackListToken.model')
const userService = require('../services/user.service');
const { validationResult } = require('express-validator')
const sendEmail = require('../utils/sendMail.utils')
const jwt = require('jsonwebtoken')

module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(401).json({ errors: errors.array() })
    }

    try {
        const { name, email, password } = req.body;

        const isAlreadyExist = await userModel.findOne({ email });
        if (isAlreadyExist) {
            res.status(400).json({ message: 'User already exists' })
        }

        else {
            const hashedPassword = await userModel.hashPassword(password);
            const newUser = await userService.createUser({
                name,
                email,
                password: hashedPassword
            })

            // clone default categories
            const defaults = await categoryModel.find({ isDefault: true });
            const userCats = defaults.map(d => ({
                name: d.name,
                icon: d.icon,
                color: d.color,
                type: d.type,
                userId: newUser._id,
                isDefault: false,
            }));
            await categoryModel.insertMany(userCats);

            

            const accessToken = newUser.generateAuthToken();
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            })
            res.status(201).json({ accessToken, newUser });
        }


    } catch (error) {
        next(error);
    }
}

module.exports.loginUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() })
    }

    try {

        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const accessToken = user.generateAuthToken();
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.status(201).json({ accessToken, user });

    } catch (error) {
        next(error);
    }
}

module.exports.getUserProfile = async (req, res, next) => {

    return res.status(200).json({ user: req.user });
}

module.exports.logoutUser = async (req, res, next) => {

    const accessToken = req.cookies.accessToken || req.header.authorization?.split(' ')[1];
    // const sessionId = req.cookies.connect.sid
    res.clearCookie('accessToken');
    res.clearCookie('connect.sid');

    await blackListTokenModel.create({ token: accessToken });

    return res.status(200).json({ message: 'Logged out successfully' })
}

module.exports.forgetPassword = async (req, res, next) => {

    let email = req.body.email;

    if (!email) {
        const pass_key_id = req.cookies.pass_key_id || req.headers.authorization?.split(' ')[1];
        if (!pass_key_id) {
            return res.status(440).json({ message: 'Session expired. Please request a new OTP.' });
        }
        try {
            email = jwt.verify(pass_key_id, process.env.EMAIL_JWT_SECRET).email;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(440).json({ message: 'Session expired. Please request a new OTP.' });
            }
            return next(error);
        }
    }

    const user = await userModel.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ message: "Incorrect email" })
    }

    try {
        const userOtp = user.password_otp?.otp;
        if (userOtp) {
            const timeDiff = new Date().getTime() - new Date(user.password_otp.last_attempt).getTime() <= 24 * 60 * 60 * 1000;

            if (!timeDiff) {
                user.password_otp.limit = 5;
                await user.save();
            }

            const remainingLimit = user.password_otp.limit === 5
            if (timeDiff && remainingLimit) {
                return res.status(429).json({ message: "daily limit exceeded" })
            }
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.password_otp.otp = otp;
        user.password_otp.limit--;
        user.password_otp.last_attempt = new Date();
        user.password_otp.sendTime = new Date().getTime() + 2 * 60 * 1000

        await user.save();

        const data = {
            email: email,
            otp: otp,
        }
        await sendEmail(data);


        const pass_key_id = jwt.sign({ email: email }, process.env.EMAIL_JWT_SECRET, { expiresIn: '10m' })
        res.cookie('pass_key_id', pass_key_id, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        res.status(200).json({ message: 'otp sent to given email', otp: user.password_otp.otp })

    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(440).json({ message: 'Session expired. Please request a new OTP.' });
        }
        next(error)
    }


}

module.exports.verifyOtp = async (req, res, next) => {

    const { otp } = req.body;
    const pass_key_id = req.cookies.pass_key_id || Headers.authorization?.split(' ')[1];
    if (!pass_key_id) {
        return res.status(440).json({ message: 'Session expired. Please request a new OTP.' });
    }

    try {
        const email = jwt.verify(pass_key_id, process.env.EMAIL_JWT_SECRET).email
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        const isExpire = user.password_otp.sendTime < new Date().getTime();

        if (isExpire) {
            return res.status(400).json({ message: 'invalid OTP' })
        }

        if (user.password_otp.otp !== otp) {
            return res.status(400).json({ message: 'invalid OTP' });
        }

        user.password_otp.otp = null;
        user.password_otp.sendTime = null;
        await user.save();

        res.clearCookie('pass_key_id');
        const accessToken = user.generateAuthToken();
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        return res.status(200).json({ message: 'OTP verified successfully' });
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(440).json({ message: 'Session expired. Please request a new OTP.' });
        }
        next(error);
    }

}

module.exports.updatePassword = async (req, res, next) => {

    const { password } = req.body;
    const user = req.user;

    try {
        const hashedPassword = await userModel.hashPassword(password);
        user.password = hashedPassword;
        user.save();
        res.clearCookie('accessToken');
        res.clearCookie('connect.sid');

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {

        return res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}