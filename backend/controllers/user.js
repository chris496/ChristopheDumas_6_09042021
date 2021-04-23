const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

function encrypt(){
    
}
exports.signup = (req, res, next) => {
    const cryptMail = CryptoJS.HmacSHA256(req.body.email, "phrasesecrete").toString();
    console.log(cryptMail)
    
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email:cryptMail,
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
    const cryptMail = CryptoJS.HmacSHA256(req.body.email, "phrasesecrete").toString();
    console.log(cryptMail)
    //const decryptMail = CryptoJS.AES.decrypt(cryptMail, "phrasesecrete").toString();
    //const test = decryptMail.toString(CryptoJS.enc.Utf8)
    //console.log(test)
    User.findOne({ email: cryptMail})
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
                            'RANDOM_TOKEN_SECRET',//key secret
                            { expiresIn: '2h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

