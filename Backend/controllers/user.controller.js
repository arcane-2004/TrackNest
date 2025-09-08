const userModel = require('../models/user.model');
const blackListTokenModel = require('../models/blackListToken.model')
const userService = require('../services/user.service');
const { validationResult } = require('express-validator')

module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(401).json({errors: errors.array() })
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

            const accessToken = newUser.generateAuthToken();
            res.cookie('accessToken', accessToken,{
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

module.exports.loginUser = async (req, res, next) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors: errors.array()})
    }

    try{

        const {email, password} = req.body;
        const user = await userModel.findOne({email:email});

        if(!user){
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const accessToken = user.generateAuthToken();
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.status(201).json({accessToken, user});

    }catch(error){
        next(error);    
    }
}

module.exports.getUserProfile = async (req, res, next) =>{
    
    return res.status(200).json({user:req.user});
}

module.exports.logoutUser = async( req, res, next) => {

    const accessToken = req.cookies.accessToken || req.header.authorization?.split(' ')[1];
    // const sessionId = req.cookies.connect.sid
    res.clearCookie('accessToken');
    // res.clearCookie('connect.sid');

    await blackListTokenModel.create({token: accessToken});

    return res.status(200).json({message: 'Logged out successfully'})
}