const categoryModel = require("../models/category.model");
const categoryService = require("../services/category.services")

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

module.exports.addCategory = async(req, res, next) => {
    const user = req.user;
    if(!user){
        return res.status(401).json({message: "user not defined"});
    }

    try{
        const{name, type, color, icon} = req.body;

        const newCategory = categoryService.createCategory({
            userId: user._id,
            name,
            type,
            color,
            icon
        })

        return res.status(201).json({category: newCategory, message: "Category created successfully"});
    }catch(error){
        return res.status(500).json({message: "Internal server error", error: error.message});
    }
}