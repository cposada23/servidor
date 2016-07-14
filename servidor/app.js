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
const AuthModule    = require('./auth/facebook/AuthModule');
const authCtrl      = require('./auth/controllers/auth.ctrl');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI, config.mongo.options);
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




/*
app.post('/auth/facebook',
    authCtrl.facebookAuth, authCtrl.retrieveUser, authCtrl.generateToken, (req, res) => {
        res.json({token: req.genertedToken});
    });
*/



/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')} in ${app.get('env')} mode`);
});

module.exports = app;


