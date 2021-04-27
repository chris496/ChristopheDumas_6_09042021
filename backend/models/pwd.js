const passwordValidator = require('password-validator');

const schema = new passwordValidator();

schema
.is().min(8)
.is().max(100)
.has().uppercase()
.has().lowercase()
.has().not().spaces()

module.exports = schema;

