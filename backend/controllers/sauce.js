const Sauce = require("../models/sauce");
const fs = require('fs');

exports.postSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({error}));
}

exports.getAllSauces = (req, res) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

exports.updateOneSauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({error}));
};

exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.updateLikes = (req,res) => {
    Sauce.findOne({_id: req.params.id}) 
    .then(() => {
        if(req.body.like == 1){
            Sauce.updateOne(
                {_id: req.params.id},
                { $push: {usersLiked: req.body.userId}, $inc: {likes: +1}}
            )
            .then(() => res.status(200).json({ message: 'Sauce like'}))
            .catch((error) => res.status(400).json({ error }));
        }
        else if(req.body.like == -1){
            Sauce.updateOne(
                {_id: req.params.id},
                { $push: {usersDisliked: req.body.userId}, $inc: {dislikes: +1}}
            )
            .then(() => res.status(200).json({ message: 'Sauce dislike'}))
            .catch((error) => res.status(400).json({ error }));
        }
        else if(req.body.like == 0){
            Sauce.findOne({ _id: req.params.id })
            .then(sauce => 
                {
                    if(sauce.usersLiked.find(sauce => sauce.usersLiked = req.body.userId)){
                        Sauce.updateOne(
                            {_id: req.params.id},
                            { $pull: {usersLiked: req.body.userId}, $inc: {likes: -1}}
                        )
                        .then(() => res.status(200).json({ message: 'Sauce dislike'}))
                        .catch((error) => res.status(400).json({ error }));
                    }
                    if(sauce.usersDisliked.find(sauce => sauce.usersDisliked = req.body.userId)){
                        Sauce.updateOne(
                            {_id: req.params.id},
                            { $pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}}
                        )
                        .then(() => res.status(200).json({ message: 'Sauce dislike'}))
                        .catch((error) => res.status(400).json({ error }));
                    }
                })}
            })
            .catch((error) => res.status(500).json({ error }));
        }