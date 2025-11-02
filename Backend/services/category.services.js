const categoryModel = require("../models/category.model");

module.exports.createCategory = async ({userId, name, color, icon, type}) => {
    if(!userId || !name || !type){
        throw new Error('Fields required');
    }
    else{
        const category = await categoryModel.create({
            userId,
            name,
            color,
            icon,
            type
        })
        return category;
    }
}