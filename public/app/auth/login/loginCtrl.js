(function () {
    angular
        .module("passalo")
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$rootScope','UserService'];
    function loginCtrl($rootScope, UserService) {
        var vm = this;

        vm.loginData = {};
        vm.user = {};
        vm.logged = false;
        vm.login = function (provider) {
            console.log("haciendo login");
            UserService.authenticate(provider);
        };

        vm.logOut = function () {
            console.log("loggin out");
            UserService.logOut();
        };


        $rootScope.$on('userLoggedIn', function(){
            loadUserData();
            console.log("user logged in");
        });

        $rootScope.$on('userLoggedOut', function(){
            loadUserData();
            console.log("user loggedOut ");

        });

        // activate function on controller load,
        // so we can load stored token data
        activate();

        function activate() {
            console.log("se activo activate");
            loadUserData();
        }

        function loadUserData() {
            vm.user   = UserService.getUser();
            console.log("user: passalo " +  JSON.stringify(vm.user) );
            vm.logged = UserService.isAuthenticated();
            console.log("scppe.logged"+ vm.logged);
        }
    }
}());