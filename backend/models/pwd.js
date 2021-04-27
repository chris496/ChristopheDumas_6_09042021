const passwordValidator = require('password-validator');

const schema = new passwordValidator();

// schéma de validation des mots de passe
schema
.is().min(8)
.is().max(100)
.has().uppercase()
.has().lowercase()
.has().not().spaces()

module.exports = schema;

