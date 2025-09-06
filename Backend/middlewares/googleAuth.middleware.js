const userModel = require('../models/user.model')
const googleAuth = async (req, res, next) => {

    try{

        const findedUser = await userModel.findOne({email: req.user?._json?.email})
        let savedUser;
        if(!findedUser){
            const newUser = new userModel({
                name: req.user?._json?.name,
                email: req.user?._json?.email,
                imageUrl: req.user?._json?.picture,
                googleId: req.user?._json?.sub
            })
            savedUser = await newUser.save();
        }

        const accessToken = (findedUser || savedUser).generateAuthToken();
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        
        next();

    }catch(error){
        next(error)
    }

}

module.exports = googleAuth;