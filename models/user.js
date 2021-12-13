/* MODEL DE DONNEES UTILISATEUR || Shéma de données d'un user */

// importations
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { isEmail } = require('validator');

// création du schéma de données d'un user 
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, validate: [isEmail, 'Please enter a valid email'] }, 
  password: { type: String, required: true }
});

// pré-valide les informations avant de les enregistrer avec le plugin mongoose-unique-validator
// pour qu'il n'y est pas plusieurs utilisateurs avec la même adresse mail
userSchema.plugin(uniqueValidator);

// exporte le schéma
module.exports = mongoose.model('User', userSchema);