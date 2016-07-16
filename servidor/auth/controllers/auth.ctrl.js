'use strict';
const AuthModule    = require('../services/AuthModule');
const Facebook      = require('../facebook/facebookAuth');
const Local         = require('../local/localAuth');
const TokenService  = require('../services/TokenService');
const crypto        = require('crypto');
const nodemailer    = require('nodemailer');
const smtptransport= require('nodemailer-smtp-transport');
const User = require('../../models/Usuario');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = {
    facebookAuth,
    localAuth,
    localsingup,
    retrieveUser,
    generateToken,
    forgot
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
    req.assert('email', 'El email no es valido ').isEmail();
    req.assert('email', 'Llene el campo del email').notEmpty();
    req.assert('password', 'Ingrese su contraseña').notEmpty();
    req.assert('firstName', 'Ingrese su nombre').notEmpty();
    req.assert('lastName', 'ingrese su apellido').notEmpty();
    req.assert('password', 'La contraseña debe tener al menos 4 caracteres').len(4);
    req.assert('confirm', 'Las contraseñas no coinciden').equals(req.body.password);

    req.sanitize('email').normalizeEmail({remove_dots:false});

    var errors = req.validationErrors();
    if(errors){
        console.log("error en local singup" +  JSON.stringify(errors));
        return res.status(400).send(errors);
    }

    var datos = req.body;
    console.log("datos en auth controller local signup" +JSON.stringify(datos));
    Local.localSingUp(datos, function (err, user) {
        if(err || !user){
            console.log("error en autcontrolerr localsignup");
            return res.status(400).send(err);
            //return next({status: 401, err: 'User not found'});
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


/**
 * Recuperar la contraseña en caso de olvidarla
 * @param req
 * @param res
 */
function forgot(req, res) {
    req.assert('email','Debe ingresar un email valido').isEmail();
    req.assert('email', 'Debe ingresar su emal').notEmpty();
    req.sanitize('email').normalizeEmail({remove_dots:false});

    var errors = req.validationErrors();
    if(errors){
        console.log("Errores en forgot " + JSON.stringify(errors));
        return res.status(400).send(errors);
    }

    User.findOne({email:req.body.email}, function (err, user) {
        if(err) return res.status(400).send([{"param": "email", "msg":"Algo salio mal intente de nuevo mas tarde"}]);
        if(!user) return res.status(400).send([{"param": "email", "msg":"El email no esta asociado a ninguna cuenta de passalo"}]);

        crypto.randomBytes(16,function (err, buf) {
            console.log("por aqui")
            var token = buf.toString('hex');


            var options = {
                auth: {
                    api_user: 'camilo.posadaa',
                    api_key: 'CpA19876abc--'
                }
            };

            var transporter = nodemailer.createTransport(sgTransport(options));




            /*
            var transporter = nodemailer.createTransport({

                service: 'Mailgun',
                auth:{
                    user:process.env.MAILGUN_USERNAME,
                    pass:process.env.MAILGUN_PASSWORD
                }
            });*/

           /* var email = {
                from: 'awesome@bar.com',
                to: user.email,
                subject: 'Hello',
                text: 'Hello world',
                html: '<b>Hello world</b>'
            };*/

           var email = {
                to: user.email,
                from: 'postmaster@peiname.me',
                subject:'Recuperar contraseña',
                text: 'Esta reciviendo este email poque usted o alguien mas a requerido recuperar la contraseña para su cuenta de passalo \n' +
                'Para completar el proceso ingrese al siguiente link\n\n'+
                'http://'+req.header.host+'/reset/'+token+'\n\n'+
                'Si nno fue usted el que requirio recuperar la contraseña, ignore este email y su contraseña no cambiara.\n'
            };
            transporter.sendMail(email, function (err) {
                if(err){
                    console.log("error en transportersendmail " + err);
                    return res.status(400).send([{"param": "transporter", "msg":"Algo salio mal, intente de nuevo mas tarde"}]);

                } return res.status(200).send([{"param": "trasnporter", "msg":"Se envio un email a " +user.email+" con instrucciones sobre como recuperar su contraseña"}]);
            });

        });





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
