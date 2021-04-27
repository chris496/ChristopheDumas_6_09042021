const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const pwdvalid = require('../middleware/pwdvalid');

router.post('/signup', pwdvalid, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
