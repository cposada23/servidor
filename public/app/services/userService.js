(function(){
    "use strict";

    angular
        .module('passalo')
        .factory('UserService', UserService);

    function UserService($rootScope, $auth) {
        var userData = $auth.getPayload();

        return {
            isAuthenticated: function(){
                return $auth.isAuthenticated();
            },

            login: function (user) {
                $auth.login(user).then(this.successAuth).catch(this.failedAuth);
            },
            signup: function (user) {
                $auth.signup(user).then(this.successSingup).catch(this.failedSingup);
            },
            socialSingup: function (provider) {
              $auth.authenticate(provider)
                  .then(this.successSocialSingup)
                  .catch(this.failedSocialSingup);
            },
            authenticate: function(provider) {
                $auth
                    .authenticate(provider)
                    .then(this.successAuth)
                    .catch(this.failedAuth);
            },
            logOut: function() {
                $auth.logout();
                userData = undefined;

                $rootScope.$emit('userLoggedOut');
            },
            getUser: function(){
                return userData;
            },
            successAuth: function() {
                userData = $auth.getPayload();
                $rootScope.$emit('userLoggedIn', {data: userData});
            },
            successSingup: function (response) {
                $auth.setToken(response);
                userData = $auth.getPayload();
                $rootScope.$emit('userSingUp', {data: userData});
            },
            successSocialSingup: function () {
                userData = $auth.getPayload();
                $rootScope.$emit('userSingUp', {data: userData});
            },
            failedAuth: function() {
                userData = undefined;
                $rootScope.$emit('userFailedLogin');
            },
            failedSingup: function (response) {
                userData = undefined;
                $rootScope.$emit('userFailedSingUp', {error: response});
            },
            failedSocialSingup: function () {
                userData = undefined;
                $rootScope.$emit('userFailedSingUp', {error: response});

            }
        }
    }
})();
