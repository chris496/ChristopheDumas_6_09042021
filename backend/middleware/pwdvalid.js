const passwordValidator = require('password-validator');
const schema = require('../models/pwd');

module.exports = (req, res, next) => {
    if (!schema.validate(req.body.password)){
        return res.status(400).json ({error: 'mot de passe trop faible'})
    }
    next()
}