(function () {
    angular
        .module('passalo',['ui.router','jlareau.pnotify', 'satellizer' , 'angularSpinner', 'ui.bootstrap'])
        .config(config);

    /**
     * -------------------------Configuración de la app
     *
     */
    config.$inject = ['$stateProvider','$urlRouterProvider', '$authProvider'];
    function config($stateProvider,$urlRouterProvider, $authProvider) {
        $urlRouterProvider.otherwise('home');
        $stateProvider
            .state('Home',{
                url:'/home',
                templateUrl:'public/app/home/home.html',
                controller:'homeCtrl as home'
            })
            .state('SingUp',{
                url:'/singUp',
                templateUrl:'public/app/auth/singup/singup.html',
                controller: 'singupCtrl as singup'
            })
            .state('Forgot',{
                url:'/forgot',
                templateUrl:'public/app/auth/forgot/forgot.html',
                controller: 'forgotCtrl as forgot'
            })
            .state('Reset',{
                url:'/reset/:token',
                templateUrl:'public/app/auth/reset/reset.html',
                controller:'resetCtrl as reset'
            });

        var commonConfig = {
            popupOptions: {
                location: 'no',
                toolbar: 'yes',
            }
        };

        //commonConfig.redirectUri = 'http://localhost:3000/';
        commonConfig.redirectUri = window.location.origin + '/';
        //http://passalov2.herokuapp.com/
        //commonConfig.redirectUri = 'https://passalov2.herokuapp.com/';
        $authProvider.singupUrl = '/auth/signup';
        $authProvider.facebook(angular.extend({}, commonConfig, {
            clientId: '1770043263275650',

            url: 'https://passalov2.herokuapp.com/auth/facebook'
            //url:'http://localhost:3000/auth/facebook'
        }));
    }
}());