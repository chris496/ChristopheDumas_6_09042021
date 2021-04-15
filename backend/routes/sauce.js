const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const sauceCtrl = require('../controllers/sauce');

//const multer = require('../middleware/multer');

router.post('/', sauceCtrl.postSauce);
router.get('/', sauceCtrl.getAllSauces);
router.get('/:id', sauceCtrl.getOneSauce);
router.put('/:id', sauceCtrl.updateOneSauce);

module.exports = router;