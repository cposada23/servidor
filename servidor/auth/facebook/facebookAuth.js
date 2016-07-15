'use strict';
const request   = require('request');

module.exports = {
    facebookAuthentication
};

/**
 * Autenticacion usando api graph de facebook
 * Aqui se recibe el codigo desde la aplicacion de angular o ionic
 * este se pasa al api de facebook. Luego el codigo de autenticación es
 * cambiado por el access token
 * @param options
 * @param cb
 */
function facebookAuthentication(options, cb) {
    const fields          = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    const accessTokenUrl  = 'https://graph.facebook.com/v2.5/oauth/access_token';
    const graphApiUrl     = `https://graph.facebook.com/v2.5/me?fields=${fields.join(',')}`;

    const params = {
        code: options.code,
        client_id: options.clientId,
        redirect_uri: options.redirectUri,
        client_secret: process.env.FACEBOOK_SECRET
    };

    // Step 1. Exchange authorization code for access token.
    request.get({url: accessTokenUrl, qs: params, json: true}, (err, response, accessToken) => {
        if(response.statusCode !== 200) {
            console.log("error linea 31 facebok atuh");
            return cb(accessToken.error.message);
        }

        // Step 2. Retrieve profile information about the current user.
        request.get({url: graphApiUrl, qs: accessToken, json: true}, (err, response, profile) => {
            if(response.statusCode !== 200){
                console.log("error linea 38 facebook auth");
                return cb(accessToken.error.message);
            }

            // Here we will normalize facebook response to our user schema
            // So later we can use multiple providers
            const user = {
                profilePicture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
                firstName: profile.first_name,
                lastName: profile.last_name,
                profiles: {
                    facebook: profile.id
                },
                email: profile.email,
                token: accessToken
            };

            cb(null, {type:'facebook', user});
        });
    });
}
