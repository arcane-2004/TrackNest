const userModel = require('../models/user.model')

const googleAuth = async (req, res, next) => {

    try{

        const findedUser = await userModel.findOne({email: req.user?._json?.email})

        if(!findedUser){
            const newUser = new userModel({
                name: req.user?._json?.name,
                email: req.user?._json?.email,
                imageUrl: req.user?._json?.picture,
                googleId: req.user?._json?.sub
            })
            await newUser.save();
        }

        next();

    }catch(error){
        next(error)
    }

}

module.exports = googleAuth;