const userModel = require('../models/user.model');

module.exports.createUser = async ({
    name, email, password
}) => {
    if(!name || !email || !password){
        throw new Error('All fields required')
    }

    const user = userModel.create({
        name : name,
        email: email,
        password: password
    })
    return user;
}