/* CONTROLLERS UTILISATEURS || Logique métier pour user */

// importations
const User =  require('../models/User'); // shéma de User
const bcrypt = require ('bcrypt'); // package cryptage de mot de passe
const jwt = require('jsonwebtoken'); // package pour créer et vérifier les tokens d'authentification 

/* Exports des fonctions */

// inscription utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //req.body.passssword = récupération du mot de passe saisi dans le frontend, 10 = salt = le nombre de tour de l'algorithme pour sécurisé, plus on fait de tour plus c'est long
        .then(hash => { 
            const user = new User({
                email: req.body.email,
                password: hash // assigne le hash obtenu à password
            });
            // on enregistre ce nouvel utilisateur dans la base de données
            user.save() // sauvegarde dans MongoDB
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        // s'il y a une erreur
        .catch(error => res.status(500).json({ error })); 
};

// connexion utilisateur existant
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // findOne pour trouver l'utilisateur dans la base de données
        .then(user => { // vérifie si on a récupérer un user ou non dans la base
            if (!user) { // si on n'a pas trouvé de user
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password) // si on a un user, on compare le mot de passe envoyé par le frontend et le mot de passe dans la base de données
            .then(valid => { // savoir si la comparaison des mots de passse est valable ou non 
                if (!valid) { // si ce n'est pas le bon mot de passe
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                res.status(200).json({ // si la comparaison est bonne, on renvoit un objet json avec l'id de l'user et un token
                    userId: user._id, // renvoie _ID généré par MongoDB
                    token: jwt.sign( // fonction sign pour encoder un nouveau token
                        { userId: user._id }, // données à encoder (=payload)
                        'RANDOM_TOKEN_SECRET', // chaîne, clé secrète pour l'encodage
                        { expiresIn: '24h' } // durée de validité du token
                    )
                });
            })
            .catch(error => res.status(500).json({ error })); // si il y a une erreur serveur
        })
        .catch(error => res.status(500).json({ error })); // si il y a un problème de connexion à la base de données
  };