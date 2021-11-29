/* MIDDLEWARE MULTER || Gestion des fichiers envoyés vers l'API */

// import de multer
const multer = require('multer');

// dictionnaire pour créer l'extension du fichier à partir du MIMETYPE
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// créé un objet de configuration pour multer
const storage = multer.diskStorage({ // diskstorage = fonction pour dire qu'on l'enregistre sur le disque
    destination: (req, file, callback) => { // destination = fonction qui dit à multer où sera enregistré les fichiers
        callback(null, 'images'); //  deux arguments : null = pas d'erreurs, images = le nom du dossier de destination
    },
    filename: (req, file, callback) => { // filename = explique à multer quel nom de fichier utilisé, pour ne pas avoir deux fois le même nom de fichier par exemple
        const name = file.originalname.split(' ').join('_'); // génération du nouveau nom, split et join permette de remplacer les espaces par des _ pour ne pas avoir d'erreurs dans le serveur
        const extension = MIME_TYPES[file.mimetype]; // applique une extension aux fichiers
        callback(null, name + Date.now() + '.' + extension); // créé le 'filename' complet
    }
});

// exporte le middleware multer
module.exports = multer({storage: storage}).single('image');