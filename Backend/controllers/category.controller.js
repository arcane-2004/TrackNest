const categoryModel = require("../models/category.model");


module.exports.getCategories = async (req, res, next) => {
    
    const user = req.user;

    if(!user){
        return res.status(401).json({message: "user not defined"});
    }
    try{
        const categories = await categoryModel.find({userId: user._id})
        return res.status(200).json({categories});
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}