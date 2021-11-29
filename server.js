/* SERVER NODE */

// importer le package http de node
const http = require('http');
// importer app.js
const app = require('./app');

// la fonction 'normalizePort' renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) { //si port n'est pas un nombre
    return val; // renvoie valeur
  }
  if (port >= 0) { // si port >= 0
    return port; // renvoie le port
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000'); // permet de se servir de tous les ports
app.set('port', port);

// la fonction 'errorHandler' recherche les différentes erreurs et les gère
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES': // si permission refusée
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE': // si port déjà utilisé
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
