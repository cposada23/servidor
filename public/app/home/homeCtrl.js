(function () {
    angular
        .module("passalo")
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$rootScope','UserService', 'notificationService', 'usSpinnerService','$uibModal'];
    function homeCtrl($rootScope, UserService, notificationService ,usSpinnerService , $uibModal) {
        var vm = this;

        vm.loginData = {};
        vm.user = {};
        vm.logged = false;


        vm.logOut = function () {
            console.log("loggin out");
            UserService.logOut();
        };

        vm.showLogin = function () {
            console.log("abriendo login");
            var loginInstance = $uibModal.open({
                templateUrl: '/public/app/auth/modals/login/loginModal.html',
                controller: 'loginModalCtrl',
                //backdrop:'static'
            });
            loginInstance.result.then(function (data) {
                console.log("data cerrrado login instance " + JSON.stringify(data));
            }, function () {
                console.log("login rejected");
            });
        };


        vm.showSingup = function () {
            console.log("abriendo signup");
            var singupInstance = $uibModal.open({
                templateUrl: '/public/app/auth/modals/singup/singupModal.html',
                controller: 'singupModalCtrl',

            });
            singupInstance.result.then(function (data) {
                console.log("cerrado singup " + JSON.stringify(data));

            }, function () {
                console.log("singup rejected");
            });

        };

        vm.showProfile = function () {
            console.log("show profile");
            var modalInstance = $uibModal.open({
                templateUrl: '/public/app/modal/profile/profileModal.html',
                controller: 'profileModal',
                resolve: {
                    user: function () {
                        return vm.user;
                    }
                },

                backdrop: 'static'
            });

            modalInstance.result.then(function(data) {
                //resolved
                console.log('resolved' +data);
            }, function() {
                //rejected
                console.log("rejected");
            })
        };



        $rootScope.$on('userLoggedIn', function(){
            loadUserData();
            console.log("user logged in homectrl");
            //usSpinnerService.stop('spinner-1');
        });

        $rootScope.$on('userSingUp', function(){
            notificationService.success('registro correcto');
            loadUserData();
        });

        $rootScope.$on('userLoggedOut', function(){
            loadUserData();
            console.log("user loggedOut ");

        });

        $rootScope.$on('userFailedLogin', function () {
            console.log("failed login");
            notificationService.error('Error!!');
            usSpinnerService.stop('spinner-1');
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
            console.log("user: passalo homectrl" +  JSON.stringify(vm.user) );
            vm.logged = UserService.isAuthenticated();
            console.log("scppe.logged homectrl"+ vm.logged);
        }
    }
}());