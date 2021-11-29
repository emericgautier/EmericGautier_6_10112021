/* MIDDLEWARE D'AUTHENTIFICATION || Protège les routes sélectionnées et vérifie que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes */

// importation 
const jwt = require('jsonwebtoken'); // package pour créer et vérifier les tokens d'authentification

// exporte le middleware (appliqué avant les controllers des routes)
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupération du token dans le header de la requête, ça nous retourne un tableu et on récupère le deuxième élément du tableau (le 1)
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // décode le token (génère un objet JS)
        const userId = decodedToken.userId; // extrait le userId de l'objetJS généré juste avant
        // si on a un user Id dans le body de la requête et qu'il est différent de l'user id du token
        if (req.body.userId && req.body.userId !== userId) {
        throw 'Invalid user ID';
        // si l'user Id du body correspond à celui du token, on passe au prochain middleware
        } else {
        next(); //si OK, poursuit avec une route de sauce
        }
    } catch {
        res.status(401).json({
        error: new Error('Invalid request!')
        });
    }
};