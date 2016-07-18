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
            UserService.logOut();
        };

        vm.showLogin = function () {
            var loginInstance = $uibModal.open({
                templateUrl: '/public/app/auth/modals/login/loginModal.html',
                controller: 'loginModalCtrl',
            });
            loginInstance.result.then(function (data) {

            }, function () {

            });
        };


        vm.showSingup = function () {
            var singupInstance = $uibModal.open({
                templateUrl: '/public/app/auth/modals/singup/singupModal.html',
                controller: 'singupModalCtrl',

            });
            singupInstance.result.then(function (data) {

            }, function () {
            });

        };

        vm.showProfile = function () {
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
            }, function() {
                //rejected
            })
        };



        $rootScope.$on('userLoggedIn', function(){
            loadUserData();
        });

        $rootScope.$on('userSingUp', function(){
            loadUserData();
        });

        $rootScope.$on('userLoggedOut', function(){
            loadUserData();
        });

        $rootScope.$on('userFailedLogin', function () {
            usSpinnerService.stop('spinner-1');
        });

        // activate function on controller load,
        // so we can load stored token data
        activate();

        function activate() {
            loadUserData();
        }

        function loadUserData() {
            vm.user   = UserService.getUser();
            vm.logged = UserService.isAuthenticated();
        }
    }
}());