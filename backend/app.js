// import des packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const nocache = require('nocache');

//gère les variables d'environnement
require('dotenv').config();

// import des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//
const app = express();

// connexion à mongodb
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DATA_BASE_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// execution des fonctions
app.use(nocache());
app.use(helmet());
app.use(bodyParser.json());
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// fichier static pour le traitement des images
app.use('/images', express.static(path.join(__dirname, 'images')));

// utilisation de cookie-session
app.use(
  cookieSession({
  secret:'s3Cur3',
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000'
  }
}));

//export de app
module.exports = app;