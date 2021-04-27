const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

// routes vers les middleware auth, multer ou controllers
router.post('/', auth, multer, sauceCtrl.postSauce);
router.post('/:id/like', auth, sauceCtrl.updateLikes);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.updateOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteOneSauce);

module.exports = router;