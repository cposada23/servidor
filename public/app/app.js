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
                controller:'loginCtrl as login'
        });

        var commonConfig = {
            popupOptions: {
                location: 'no',
                toolbar: 'yes',
            }
        };

        //commonConfig.redirectUri = 'http://localhost:3000/';
        commonConfig.redirectUri = window.location.origin + '/';
        $authProvider.facebook(angular.extend({}, commonConfig, {
            clientId: '1770043263275650',

            //url: 'https://passalov2.herokuapp.com/auth/facebook'
            url:'http://localhost:3000/auth/facebook'
        }));


    }
}());