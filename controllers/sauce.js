/* CONTROLLERS SAUCE || Logique métier pour sauce */

// importations
const Sauce = require('../models/Sauce'); // importe le shéma de Sauce
const fs = require('fs'); // permet de modifier le système de fichiers


/* exporte les fonctions */

// création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // récupère chaque segment de l'URL de la localisation de l'image
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

// modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? // opérateur qui test si nouvelle iage = 1er objet avec req.file, sinon = 2ème objet avec copie de req.body
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // cherche la sauce dans la BDD
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]; // extrait le nom du fichier à supprimer
      fs.unlink(`images/${filename}`, () => { // fs.unlink permet de supprimer le fichier
        Sauce.deleteOne({ _id: req.params.id }) // supprime la sauce dans la BDD
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// récupére une sauce spécifique 
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}) // cherche le même id
  .then((sauce) => {res.status(200).json(sauce);
    }
  ).catch((error) => { res.status(404).json({
     error: error
    });
    }
  );
};

// récupére toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauces) => { res.status(200).json(sauces); }
  )
  .catch(
    (error) => { res.status(400).json({
        error: error
      });
    }
  );
};









// création de like ou dislike
// 3 conditions : la valeur de req.body.like est soit:
// 0 = utilisateur annule son like ou dislike
// 1 = l'utilisateur like
// -1 = l'utilisateur dislike
exports.likeOrDislikeSauce = (req, res, next) => {
  if (req.body.like === 1) { // si l'utilisateur like la sauce
    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } }) // ajoute 1 like et l'envoi dans le tableau "usersLiked"
      .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
      .catch(error => res.status(400).json({ error }));
  } else if (req.body.like === -1) { // si l'utilisateur dislike la sauce
    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } }) // ajoute 1 dislike et l'envoi dans le tableau "usersDisliked"
      .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
      .catch(error => res.status(400).json({ error }));
  } else { // si like === 0 l'utilisateur supprime son vote
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (sauce.usersLiked.includes(req.body.userId)) { // si le tableau "userLiked" contient l'ID de l'utilisateur
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }) // on enlève un like du tableau "userLiked" 
              .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
              .catch(error => res.status(400).json({ error }))
        } else if (sauce.usersDisliked.includes(req.body.userId)) { // si le tableau "userDisliked" contient l'ID de l'utilisateur
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } }) // on enlève un dislike du tableau "userDisliked" 
              .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
              .catch(error => res.status(400).json({ error }))
        }
      })
      .catch(error => res.status(400).json({ error }));
  }
};