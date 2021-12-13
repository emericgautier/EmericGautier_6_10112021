/* APPLICATION */

// importations
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');  //import de path pour donner accès au chemin de notre système de fichier
const helmet = require('helmet'); //défini divers en-têtes HTTP sécurisées
require('dotenv').config(); //charge les variables d'environnement

// création de notre application Express || appel de la méthode express()
const app = express();

// pour sécuriser les entêtes des requètes
app.use(helmet());

// connexion à BDD MongoDB via mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gp1ym.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));



// CORS || middleware pour contourner les erreurs de CORS. || app.use traite toutes les sortes de requêtes (GET, POST,...)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // permet d'accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // permet d'envoyer des requêtes avec les méthiodes mentionnées (GET, ...)
    next(); // appeler next pour passer au middleware suivant
  });

// rend le corps des requêtes json (de tout types) => en objet JS utilisable -- anciennement body-parser ||  
app.use(express.json());

// gestion des fichiers images
app.use('/images', express.static(path.join(__dirname, 'images')));

// import des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// enregistre les routeurs dans l'application
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// exporter la constante app pour y accéder depuis les autres fichiers du projet, notament le serveur node
module.exports = app;

