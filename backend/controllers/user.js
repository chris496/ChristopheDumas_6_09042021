const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

exports.signup = (req, res, next) => {
    var key = CryptoJS.enc.Hex.parse(process.env.SECRETKEY);
    var iv = CryptoJS.enc.Hex.parse(process.env.SECRETIV);
    var encrypted = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString()
    console.log(encrypted)
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: encrypted,
                password:hash
            });
        user.save()
            .then(() => {
                res.status(201).json({message: 'Utilisateur crée !'})
            })
            .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
    var key = CryptoJS.enc.Hex.parse(process.env.SECRETKEY);
    var iv = CryptoJS.enc.Hex.parse(process.env.SECRETIV);
    var encrypted = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString()  
    // Decrypt
    //var bytes = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });
    //var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    //console.log(decryptedData)
    User.findOne({ email: encrypted})
        .then(user => {
            if(!user){
                return res.status(401).json({error:'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({error:'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, //paylod
                            process.env.JWT_TOKEN,//key secret
                            { expiresIn: '2h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};