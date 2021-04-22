const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const sauceCtrl = require('../controllers/sauce');

const multer = require('../middleware/multer');

router.post('/', auth, multer, sauceCtrl.postSauce);
router.put('/:id', auth, sauceCtrl.updateOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/:id/like', auth, sauceCtrl.updateLikes);




module.exports = router;