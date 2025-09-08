const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports.getAccess = async(req, res, next) =>{
    res.status(200).json({status: 'true'})
}

