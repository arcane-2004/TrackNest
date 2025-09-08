const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) =>{

    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    console.log("Access Token:", accessToken);

    if (!accessToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user = await userModel.findOne({email : decoded.email});
        req.user = user;
        console.log(req.user);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
} 