const userModel = require('../models/user.model');  
const userService = require('../services/user.service');
const {validationResult} = require('express-validator')

module.exports.registerUser = async (req, res, next) =>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors: errors.array()})
    }

    try{
        const {name, email, password} = req.body;

        const isAlreadyExist = await userModel.findOne({email});
        if(isAlreadyExist){
            res.status(400).json({message: 'User already exists'})
        }

        const hashedPassword = await userModel.hashPassword(password);
        const newUser = await userService.createUser({
            name,
            email,
            password: hashedPassword
        })

        const accessToken = newUser.generateAuthToken();
        res.status(201).json({accessToken, newUser});

    }catch(error){
        next(error);
    }
}