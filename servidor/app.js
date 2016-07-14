'use strict';

/**
 * Module dependencies.
 */
const express       = require('express');
const compression   = require('compression');
const dotenv        = require('dotenv');
const path          = require('path');
const mongoose      = require('mongoose');


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: 'servidor/.env' });

/**
 * Load app modules and routes
 */
const config        = require('./config/environment');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect('mongodb://miilllooooo:1234567890@ds017248.mlab.com:17248/testoauth', config.mongo.options);
mongoose.connection.on('error', () => {
    console.error('MongoDB Connection Error.');
});

/**
 * Express configuration.
 */
require('./config/express')(app);
/**
 * routes
 */
require('./endPoints/routes')(app);



app.listen(app.get('port'), () => {
    console.log(`Servidor express escuchado en el puerto ${app.get('port')} en ${app.get('env')} mode`);
});

module.exports = app;


