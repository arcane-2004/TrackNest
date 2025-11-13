const categoryModel = require("../models/category.model");

module.exports.createCategory = async ({userId, name, type, color, icon,}) => {
    if(!name || !type){
        throw new Error('Fields required');
    }
    else{
        const category = await categoryModel.create({
            userId,
            name,
            type,
            color,
            icon,
            
        })
        return category;
    }
}