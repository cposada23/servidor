'use strict';
const AuthModule = require('../services/AuthModule');
const Facebook   = require('../facebook/facebookAuth');
const Local      = require('../local/localAuth');
const TokenService = require('../services/TokenService');

module.exports = {
    facebookAuth,
    localAuth,
    localsingup,
    retrieveUser,
    generateToken
};


/**
 * Autenticación local
 * @param req
 * @param res
 * @param next
 */
function localAuth(req, res, next) {

    req.assert('email', 'El email no es valido ').isEmail();
    req.assert('email', 'Llene el campo del email').notEmpty();
    req.assert('password', 'Ingrese su contraseña').notEmpty();
    req.sanitize('email').normalizeEmail({remove_dots:false});
    var errors = req.validationErrors();
    if(errors){
        console.log("errors local auth" + JSON.stringify(errors));
        return res.status(400).send(errors);
        //return next({status:400,errors:errors});

    }

    const options = {
        password: req.body.password,
        email: req.body.email
    };
    console.log("Options en localAuth " + JSON.stringify(options));
    Local.localAuthentication(options, (err, user)=>{
        if(err || !user){
            console.log("error en autcontrolerr local authentication" +  JSON.stringify(err));
            return res.status(401).send(err);
            //return next({status: 401, err: 'User not found'});
        }
        req.user = user;

        next();
    })
}

/**
 * Loca Singup
 */

function localsingup(req, res,next){


    var datos = req.body;
    console.log("datos en auth controller local signup" +JSON.stringify(datos));
    Local.localSingUp(datos, function (err, user) {
        if(err || !user){
            console.log("error en autcontrolerr localsignup");
            return next({status: 401, err: 'User not found'});
        }
        req.user = user;

        next();
    });

}


/**
 * Social auth
 * @param req
 * @param res
 * @param next
 */
function facebookAuth(req, res, next) {
    const options = {
        code: req.body.code,
        clientId: req.body.clientId,
        redirectUri: req.body.redirectUri
    };

    Facebook.facebookAuthentication(options, (err, response) => {
        if(err){
            console.log("Error facebook Autentication authcontroller");
            return next({err, status: 401});
        }
        console.log("ser authObject autentication controntroller");
        // for larger apps recommended to namespace req variables
        req.authObject = response;

        next();
    });
}

function retrieveUser(req, res, next) {
    if(!req.authObject) {
        console.log("No hay Auth object en aut controller");
        return next({status: 401, err: 'User not found'});
    }
    console.log("hay auth object continuando ...");
    const userToRetrieve = {
        user: req.authObject.user,
        type: req.authObject.type
    };

    AuthModule.createOrRetrieveUser(userToRetrieve, (err, user) => {
        if (err || !user) {
            console.log("Error createOrRetrieve user auth controller")
            return next({status: 401, err: 'Error while fetching user'});
        }
        console.log("req.user en authcontroller " + JSON.stringify(user));
        req.user = user;

        next();
    });
}

function generateToken(req, res, next) {
    console.log("generando token en auth controller");
    TokenService.createToken({user: req.user}, (err, token) => {
        if(err){
            console.log("error generando token en auth controller");
            return next({status: 401, err: 'User Validation failed'});
        }

        console.log("token generada en auth controller " + token);
        req.generatedToken = token;
        next();
    });
}
