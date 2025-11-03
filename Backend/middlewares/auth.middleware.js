const userModel = require('../models/user.model');
const blackListTokenModel = require('../models/blackListToken.model')
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) =>{

    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlacklisted = await blackListTokenModel.findOne({accessToken:accessToken})
    if(isBlacklisted){
        return res.status(401).json({message: 'unauthorized'})
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user = await userModel.findOne({email : decoded.email});
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
} 