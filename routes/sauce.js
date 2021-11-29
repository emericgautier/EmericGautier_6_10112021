/* ROUTES SAUCE || Logique de routing pour sauce */

// importe express
const express = require('express');

// créer un routeur Express || pour implémenter des routes
const router = express.Router();

// importations 
const auth = require ('../middleware/auth'); // importe le middleware de protection de route
const multer = require('../middleware/multer-config'); // middleware de gestion de fichier

// importe la logique métier de sauce
const sauceCtrl = require('../controllers/sauce');


// routes disponibles dans l'application avec leur nom de fonction (avec une sémantique qui permet d'identifier leur rôle)
router.post('/', auth, multer, sauceCtrl.createSauce); 
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeOrDislikeSauce);

// exporter le routeur Express
module.exports = router;