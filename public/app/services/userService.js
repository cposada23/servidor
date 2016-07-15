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
            failedAuth: function() {
                userData = undefined;
                $rootScope.$emit('userFailedLogin');
            }
        }
    }
})();
