const userModel = require('../models/user.model')
const categoryModel = require('../models/category.model')
const googleAuth = async (req, res, next) => {

    try {

        const findedUser = await userModel.findOne({ email: req.user?._json?.email })
        let savedUser;
        if (!findedUser) {
            const newUser = new userModel({
                name: req.user?._json?.name,
                email: req.user?._json?.email,
                imageUrl: req.user?._json?.picture,
                googleId: req.user?._json?.sub
            })
            savedUser = await newUser.save();

            // clone default categories
            const defaults = await categoryModel.find({ isDefault: true });
            const userCats = defaults.map(d => ({
                name: d.name,
                icon: d.icon,
                color: d.color,
                type: d.type,
                userId: savedUser._id,
                isDefault: false,
            }));
            await categoryModel.insertMany(userCats);
        }



        const accessToken = (findedUser || savedUser).generateAuthToken();
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        next();

    } catch (error) {
        next(error)
    }

}

module.exports = googleAuth;